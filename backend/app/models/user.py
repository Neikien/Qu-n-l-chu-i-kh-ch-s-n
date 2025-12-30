from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    email = Column(String(100), unique=True)
    fullname = Column(String(100))
    role = Column(String(20), default="user")
    customer_id = Column(Integer, ForeignKey("KHACH_HANG.MaKH"))
    created_at = Column(DateTime)
    
    # Relationships - TẠM SỬA
    customer = relationship("Customer")  # BỎ back_populates
    # activity_logs = relationship("ActivityLog", back_populates="user")  # TẠM COMMENT
