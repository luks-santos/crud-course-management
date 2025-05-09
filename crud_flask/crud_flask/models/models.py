from typing import List
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
import enum
from datetime import datetime, timezone

db = SQLAlchemy()

class Category(enum.Enum):
    BACKEND = "Backend"
    FRONTEND = "Frontend"
    FULLSTACK = "Fullstack"

class Status(enum.Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"


class Lesson(db.Model):
    __tablename__ = "lessons"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    youtube_url: Mapped[str] = mapped_column(String(11), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'youtube_url': self.youtube_url,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'course_id': self.course_id
        }
    
class Course(db.Model):
    __tablename__ = "courses"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    category: Mapped[Category] = mapped_column(Enum(Category), nullable=False)
    status: Mapped[Status] = mapped_column(Enum(Status), nullable=False, default=Status.ACTIVE)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    lessons: Mapped[List[Lesson]] = relationship(
        "Lesson", backref="course", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category.value,
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'lessons': [lesson.to_dict() for lesson in self.lessons]
        }
