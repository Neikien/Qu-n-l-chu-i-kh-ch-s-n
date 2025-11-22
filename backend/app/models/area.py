from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Area(Base):
    __tablename__ = "KHU_VUC"
    
    MaKhuVuc = Column(Integer, primary_key=True, autoincrement=True, index=True)
    TenKhuVuc = Column(String(100), nullable=False)
    MoTa = Column(Text)
    ViTri = Column(String(255))
    
    # Relationships
    hotels = relationship("Hotel", back_populates="area")
