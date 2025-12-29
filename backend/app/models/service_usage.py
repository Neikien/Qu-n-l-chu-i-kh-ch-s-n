from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class ServiceUsage(Base):
    __tablename__ = "SU_DUNG_DV"
    
    MaSuDung = Column(Integer, primary_key=True, autoincrement=True, index=True)
    MaDatPhong = Column(Integer, ForeignKey("DAT_PHONG.MaDatPhong"))
    MaDV = Column(Integer, ForeignKey("DICH_VU.MaDV"))
    SoLuong = Column(Integer, default=1)
    ThanhTien = Column(Numeric(10, 2))  # ⬅️ ĐỔI Decimal → Numeric
    
    # Relationships
    booking = relationship("Booking", back_populates="service_usages")
    service = relationship("Service", back_populates="service_usages")
