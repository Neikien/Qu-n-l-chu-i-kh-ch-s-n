from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class Role(str, Enum):
    admin = 'admin'
    khach_hang = 'khach_hang'  # Đổi thành tiếng Việt cho đồng bộ
    nhan_vien = 'nhan_vien'

class SignupRequest(BaseModel):
    username: str
    password: str
    email: EmailStr  # Dùng EmailStr để validation
    fullname: str

class UserResponse(BaseModel):
    id: int  # Đổi từ user_id (UUID) → id (Integer)
    username: str
    email: EmailStr
    fullname: str
    role: Role
    customer_id: Optional[int] = None  # Thêm liên kết với KHACH_HANG

class UserUpdate(BaseModel):
    current_password: str  # Bắt buộc nhập password hiện tại
    new_password: Optional[str] = None
    email: Optional[EmailStr] = None  # Dùng EmailStr
    fullname: Optional[str] = None

class LoginRequest(BaseModel):  # THÊM MỚI - cho endpoint login
    username: str
    password: str

class TokenResponse(BaseModel):  # THÊM MỚI - response khi login
    access_token: str
    token_type: str
