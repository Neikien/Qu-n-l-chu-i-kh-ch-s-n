from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class CustomerType(str, Enum):
    ca_nhan = 'Cá nhân'
    doanh_nghiep = 'Doanh nghiệp'
    vip = 'VIP'

class CustomerCreate(BaseModel):
    HoTen: str
    SoDienThoai: Optional[str] = None
    Email: Optional[EmailStr] = None
    CCCD: Optional[str] = None
    DiaChi: Optional[str] = None
    LoaiKH: CustomerType = CustomerType.ca_nhan

class CustomerUpdate(BaseModel):
    HoTen: Optional[str] = None
    SoDienThoai: Optional[str] = None
    Email: Optional[EmailStr] = None
    CCCD: Optional[str] = None
    DiaChi: Optional[str] = None
    LoaiKH: Optional[CustomerType] = None

class CustomerResponse(BaseModel):
    MaKH: int
    HoTen: str
    SoDienThoai: Optional[str]
    Email: Optional[str]
    CCCD: Optional[str]
    DiaChi: Optional[str]
    LoaiKH: CustomerType

    class Config:
        from_attributes = True
