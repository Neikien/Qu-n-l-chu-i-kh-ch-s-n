from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base   # BẮT BUỘC

class Customer(Base):
    __tablename__ = "KHACH_HANG"

    MaKH = Column(Integer, primary_key=True, autoincrement=True, index=True)
    HoTen = Column(String(100), nullable=False)
    SoDienThoai = Column(String(15))
    Email = Column(String(100))
    CCCD = Column(String(20))
    DiaChi = Column(String(255))
    LoaiKH = Column(Enum('Cá nhân', 'Doanh nghiệp', 'VIP'), default='Cá nhân')

    bookings = relationship("Booking", back_populates="customer")
    user = relationship("User")
