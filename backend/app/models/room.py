from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.core.database import Base

class Room(Base):
    __tablename__ = "PHONG"
    
    MaPhong = Column(Integer, primary_key=True, autoincrement=True, index=True)
    MaKS = Column(Integer, ForeignKey("KHACH_SAN.MaKS"))
    LoaiPhong = Column(String(50), nullable=False)
    GiaPhong = Column(Numeric(10, 2), nullable=False)  # ⬅️ ĐỔI Decimal → Numeric
    TinhTrang = Column(Enum('Trống', 'Đã đặt', 'Bảo trì'), default='Trống')
    SucChua = Column(Integer, nullable=False)
    AnhPhong = Column(String(255))
    
    # Relationships
    hotel = relationship("Hotel", back_populates="rooms")
    bookings = relationship("Booking", back_populates="room")
