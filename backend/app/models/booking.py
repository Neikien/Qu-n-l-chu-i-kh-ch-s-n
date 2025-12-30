from sqlalchemy import Column, Integer, Date, Numeric, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Booking(Base):
    __tablename__ = "DAT_PHONG"
    
    MaDatPhong = Column(Integer, primary_key=True, autoincrement=True, index=True)
    MaKH = Column(Integer, ForeignKey("KHACH_HANG.MaKH"))
    MaPhong = Column(Integer, ForeignKey("PHONG.MaPhong"))
    NgayNhanPhong = Column(Date, nullable=False)
    NgayTraPhong = Column(Date, nullable=False)
    TongTien = Column(Numeric(10, 2))
    TrangThai = Column(Enum('Đã thanh toán', 'Chưa thanh toán', 'Hủy'), default='Chưa thanh toán')
    
    # Relationships - TẠM COMMENT CÁI GÂY LỖI
    customer = relationship("Customer", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")
    # TẠM COMMENT DÒNG NÀY:
    # service_usages = relationship("ServiceUsage", back_populates="booking")
    reviews = relationship("Review", back_populates="booking")
