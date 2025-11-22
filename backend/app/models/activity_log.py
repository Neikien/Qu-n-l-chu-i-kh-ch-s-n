from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class ActivityLog(Base):
    __tablename__ = "LICH_SU_HOAT_DONG"
    
    MaHoatDong = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # Liên kết với users.id
    HanhDong = Column(String(100))
    MoTa = Column(Text)
    ThoiGian = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="activity_logs")
