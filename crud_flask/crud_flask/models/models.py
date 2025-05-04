from typing import List
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, Enum, ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
import enum

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
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), nullable=False)

class Course(db.Model):
    __tablename__ = "courses"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[Category] = mapped_column(Enum(Category), nullable=False)
    status: Mapped[Status] = mapped_column(Enum(Status), nullable=False, default=Status.ACTIVE)
    lessons: Mapped[List[Lesson]] = relationship(
        "Lesson", backref="course", lazy=True, cascade="all, delete-orphan"
    )