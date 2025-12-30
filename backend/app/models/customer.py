from sqlalchemy import Column, Integer, String, Enum, Text
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
    LoaiKH = Column(Enum('Cá nhân', 'Doanh nghiệp', 'VIP'), default='Cá nhân')
    
    # Relationships - TẠM SỬA
    # bookings = relationship("Booking", back_populates="customer")  # TẠM COMMENT
    user = relationship("User")  # BỎ back_populates
