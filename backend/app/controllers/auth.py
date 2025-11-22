from fastapi import APIRouter, HTTPException, Response, Request, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from botocore.client import BaseClient
from app.schemas.auth import SignupRequest, UserResponse, UserUpdate
from app.core.config import config
from app.core.dependencies import get_db, get_current_user, get_s3_client
from app.core.security import verify_password, hash_password, create_token, verify_token
from app.models.user import User
from datetime import datetime, timedelta, timezone

router = APIRouter()

@router.post('/login')
async def login(
    response: Response, 
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User).where(User.username == form_data.username)
    )
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    access_token = create_token({'sub': user.id})
    refresh_token = create_token({'sub': user.id}, typ='refresh')
    
    response.set_cookie(
        key="rt", 
        value=refresh_token,
        httponly=True,
        secure=True,
        expires=datetime.now(timezone.utc) + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post('/signup')
async def signup(form_data: SignupRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(User.username == form_data.username)
    )
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    result_email = await db.execute(
        select(User).where(User.email == form_data.email)
    )
    existing_email = result_email.scalar_one_or_none()
    
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    hashed_pwd = hash_password(form_data.password)
    
    user = User(
        username=form_data.username,
        password=hashed_pwd,
        email=form_data.email,
        fullname=form_data.fullname,
        role="user",
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return {'message': 'User created successfully'}

@router.get('/info', response_model=UserResponse)
async def get_user(
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.post('/logout')
async def logout(response: Response):
    response.delete_cookie('rt')
    return {'message': 'Logout successfully'}

@router.post('/refresh')
async def refresh(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    old_rt = request.cookies.get('rt')
    
    payload = verify_token(old_rt)
    user_id = payload.get('sub')
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User no longer exists")
    
    new_rt = create_token({'sub': user_id}, typ='refresh')
    response.set_cookie(
        key="rt", 
        value=new_rt,
        httponly=True,
        secure=True,
        expires=datetime.now(timezone.utc) + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    new_at = create_token({'sub': user_id})
    return {"access_token": new_at, "token_type": "bearer"}

@router.patch('/update')
async def update_user(
    request: UserUpdate,
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == user_id))
    cur_user = result.scalar_one_or_none()
    
    if not cur_user:
        raise HTTPException(status_code=404, detail="User not found")

    errors = {}

    if not verify_password(request.current_password, cur_user.password):
        errors['password'] = "Current password is incorrect"

    if request.email and request.email != cur_user.email:
        email_result = await db.execute(select(User).where(User.email == request.email))
        existing_email = email_result.scalar_one_or_none()
        if existing_email:
            errors['email'] = "Email already exists"

    if errors:
        raise HTTPException(status_code=400, detail=errors)

    update_data = {}
    if request.email:
        update_data['email'] = request.email
    if request.fullname:
        update_data['fullname'] = request.fullname
    if request.new_password:
        update_data['password'] = hash_password(request.new_password)

    if update_data:
        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(**update_data)
        )
        await db.commit()

    return {"message": "User updated successfully"}

@router.delete('/delete')
async def delete_account(
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    s3_client: BaseClient = Depends(get_s3_client)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # TODO: Xóa các dữ liệu liên quan đến khách sạn
    # await db.execute(Booking.__table__.delete().where(Booking.user_id == user_id))
    
    await db.execute(User.__table__.delete().where(User.id == user_id))
    await db.commit()

    return {"message": "Account and related data deleted successfully"}
