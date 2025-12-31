from sqlalchemy import Column, Integer, String, Enum 
from sqlalchemy.orm import relationship 
from app.core.database import Base 
 
class Customer(Base): 
    __tablename__ = "KHACH_HANG" 
 
    MaKH = Column(Integer, primary_key=True, autoincrement=True, index=True) 
    HoTen = Column(String(100), nullable=False) 
    SoDienThoai = Column(String(15)) 
    Email = Column(String(100)) 
    CCCD = Column(String(20)) 
    DiaChi = Column(String(255)) 

    user = relationship("User") 

