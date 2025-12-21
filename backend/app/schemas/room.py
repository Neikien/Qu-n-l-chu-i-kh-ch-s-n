from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from enum import Enum

class RoomStatus(str, Enum):
    trong = 'Trống'
    da_dat = 'Đã đặt'
    bao_tri = 'Bảo trì'

class RoomCreate(BaseModel):
    MaKS: int
    LoaiPhong: str
    GiaPhong: Decimal
    SucChua: int
    AnhPhong: Optional[str] = None

class RoomUpdate(BaseModel):
    LoaiPhong: Optional[str] = None
    GiaPhong: Optional[Decimal] = None
    TinhTrang: Optional[RoomStatus] = None
    SucChua: Optional[int] = None
    AnhPhong: Optional[str] = None

class RoomResponse(BaseModel):
    MaPhong: int
    MaKS: int
    LoaiPhong: str
    GiaPhong: Decimal
    TinhTrang: RoomStatus
    SucChua: int
    AnhPhong: Optional[str]

    class Config:
        from_attributes = True
