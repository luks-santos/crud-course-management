from typing import Any, Dict, List
from ..models import Lesson, db, Category, Course, Status


class CourseService:

    @staticmethod
    def get_all() -> List[Course]:
        return Course.query.all()

    @staticmethod
    def get_by_id(id: int) -> Course:
        return Course.query.get_or_404(id)

    @staticmethod
    def create(data: Dict[str, Any]) -> Course:
        course = Course(
            name=data["name"],
            category=Category[data["category"]],
            status=Status[data.get("status", "ACTIVE")],
        )
        
        for lesson_data in data["lessons"]:
            lesson = Lesson(
                name=lesson_data["name"],
                youtube_url=lesson_data["youtube_url"],
                course=course,
            )
            course.lessons.append(lesson)

        db.session.add(course)
        db.session.commit()
        return course

    @staticmethod
    def update(id: int, data: Dict[str, Any]) -> Course:
        course = CourseService.get_by_id(id)

        if "name" in data:
            course.name = data["name"]
        if "category" in data:
            course.category = Category[data["category"]]
        if "status" in data:
            course.status = Status[data["status"]]

        if "lessons" in data:
            existing_lesson_ids = {lesson.id for lesson in course.lessons}

            submitted_lesson_ids = {
                lesson_data.get("id")
                for lesson_data in data["lessons"]
                if "id" in lesson_data
            }

            lesson_ids_to_remove = existing_lesson_ids - submitted_lesson_ids

            if lesson_ids_to_remove:
                for lesson in list(course.lessons):
                    if lesson.id in lesson_ids_to_remove:
                        course.lessons.remove(lesson)

            for lesson_data in data["lessons"]:
                if "id" in lesson_data and lesson_data["id"] is not None:

                    lesson = next(
                        (l for l in course.lessons if l.id == lesson_data["id"]), None
                    )
                    if lesson:
                        if "name" in lesson_data:
                            lesson.name = lesson_data["name"]
                        if "youtube_url" in lesson_data:
                            lesson.youtube_url = lesson_data["youtube_url"]
                else:
                    lesson = Lesson(
                        name=lesson_data["name"],
                        youtube_url=lesson_data["youtube_url"],
                        course=course,
                    )
                    db.session.add(lesson)

        db.session.commit()
        return course

    @staticmethod
    def delete(id: int) -> bool:
        course = CourseService.get_by_id(id)
        db.session.delete(course)
        db.session.commit()
        return True
