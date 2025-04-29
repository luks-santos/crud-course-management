from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Enum, ForeignKey
import enum

db = SQLAlchemy()


class Category(enum.Enum):
    BACKEND = "BACKEND"
    FRONTEND = "FRONTEND"
    FULLSTACK = "FULLSTACK"


class Status(enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class Course(db.Model):
    __tablename__ = "courses"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    name: str = Column(String(100), nullable=False)
    category: Category = Column(Enum(Category), nullable=False)
    status: Status = Column(Enum(Status), nullable=False, default=Status.ACTIVE)
    lessons = db.relationship(
        "Lesson", backref="course", lazy=True, cascade="all, delete-orphan"
    )


class Lesson(db.Model):
    __tablename__ = "lessons"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    name: str = Column(String(100), nullable=False)
    youtube_url: str = Column(String(11), nullable=False)
    course_id: int = Column(Integer, ForeignKey("courses.id"), nullable=False)
