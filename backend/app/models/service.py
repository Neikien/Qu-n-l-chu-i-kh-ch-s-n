from sqlalchemy import Column, Integer, String, Decimal, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Service(Base):
    __tablename__ = "DICH_VU"
    
    MaDV = Column(Integer, primary_key=True, autoincrement=True, index=True)
    TenDV = Column(String(100), nullable=False)
    GiaDV = Column(Decimal(10, 2), nullable=False)
    MoTa = Column(Text)
    
    # Relationships
    service_usages = relationship("ServiceUsage", back_populates="service")
