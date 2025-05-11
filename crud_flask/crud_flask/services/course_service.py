import math
from typing import Any, Dict, List
from sqlalchemy.orm import Session

from crud_flask.models.models import Category, Course, Lesson, Status


class CourseService:

    def __init__(
        self, session_factory: Session, course_model: Course, lesson_model: Lesson
    ):
        self.session_factory = session_factory
        self.course_model = course_model
        self.lesson_model = lesson_model

    def __dict_to_course(self, data: dict[str, Any]) -> Course:
        try:
            course = Course(
                id=data.get("id"),
                name=data.get("name"),
                description=data.get("description"),
                category=(
                    Category[data["category"].upper()] if "category" in data else None
                ),
                status=Status[data["status"].upper()] if "status" in data else None,
            )

            if "lessons" in data:
                for lesson_data in data["lessons"]:
                    lesson = Lesson(
                        id=lesson_data.get("id"),
                        name=lesson_data.get("name"),
                        youtube_url=lesson_data.get("youtube_url"),
                    )
                    course.lessons.append(lesson)

            return course
        except Exception as e:
            raise Exception(f"Error converting dict to Course: {e}")

    def get_all(self) -> List[Dict[str, Any]]:
        try:
            session: Session = self.session_factory()
            courses: List[Course] = session.query(self.course_model).all()
            return [course.to_dict() for course in courses]
        except Exception as e:
            raise Exception(f"Error fetching all courses: {e}")
        finally:
            session.close()

    def get_all_paginated(self, page: int, per_page: int) -> Dict[str, Any]:
        try:
            session: Session = self.session_factory()
            courses: List[Course] = (
                session.query(self.course_model)
                .paginate(page=page, per_page=per_page, error_out=False)
                .items
            )
            return {
                "pageIndex": page,
                "pageSize": per_page,
                "totalCount": session.query(self.course_model).count(),
                "totalPages": math.ceil(
                    session.query(self.course_model).count() / per_page
                ),
                "canPreviousPage": page > 1,
                "canNextPage": page
                < math.ceil(session.query(self.course_model).count() / per_page),
                "data": [course.to_dict() for course in courses],
            }
        except Exception as e:
            raise Exception(f"Error fetching paginated courses: {e}")
        finally:
            session.close()

    def get_by_id(self, id: int) -> Dict[str, Any]:
        try:
            session: Session = self.session_factory()
            course: Course = session.query(self.course_model).get(id)
            if not course:
                raise Exception(f"Course with ID {id} not found")

            return course.to_dict()
        except Exception as e:
            raise Exception(f"Error fetching course with ID {id}: {e}")
        finally:
            session.close()

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            course = self.__dict_to_course(data)
            session: Session = self.session_factory()
            session.add(course)
            session.commit()
            return course.to_dict()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def update(self, id: int, data: Dict[str, Any]) -> Course:
        session = self.session_factory()
        try:
            course: Course = session.query(self.course_model).get(id)
            if not course:
                raise Exception(f"Course with ID {id} not found")

            temp_course: Course = self.__dict_to_course(data)

            if temp_course.name is not None:
                course.name = temp_course.name

            if temp_course.description is not None:
                course.description = temp_course.description

            if temp_course.category is not None:
                course.category = temp_course.category

            if temp_course.status is not None:
                course.status = temp_course.status

            if temp_course.lessons:
                existing_lessons = {lesson.id: lesson for lesson in course.lessons}

                submitted_lesson_ids = {
                    lesson.id for lesson in temp_course.lessons if lesson.id is not None
                }

                lesson_ids_to_remove = (
                    set(existing_lessons.keys()) - submitted_lesson_ids
                )
                for lesson_id in lesson_ids_to_remove:
                    lesson = existing_lessons[lesson_id]
                    course.lessons.remove(lesson)
                    session.delete(lesson)

                for temp_lesson in temp_course.lessons:
                    if (
                        temp_lesson.id is not None
                        and temp_lesson.id in existing_lessons
                    ):
                        lesson = existing_lessons[temp_lesson.id]
                        if temp_lesson.name is not None:
                            lesson.name = temp_lesson.name

                        if temp_lesson.youtube_url is not None:
                            lesson.youtube_url = temp_lesson.youtube_url
                    else:
                        new_lesson = Lesson(
                            name=temp_lesson.name,
                            youtube_url=temp_lesson.youtube_url,
                            course=course,
                        )
                        course.lessons.append(new_lesson)
                        session.add(new_lesson)

            session.commit()
            return course.to_dict()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def delete_by_id(self, id: int) -> bool:
        try:
            session = self.session_factory()
            course: Course = session.query(self.course_model).get(id)
            if not course:
                raise Exception(f"Course with ID {id} not found")

            session.delete(course)
            session.commit()
            return True
        except Exception as e:
            session.rollback()
            raise Exception(f"Error deleting course with ID {id}: {e}")
        finally:
            session.close()
