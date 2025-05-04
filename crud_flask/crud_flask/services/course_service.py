from typing import Any, Dict, List

from crud_flask.models.models import Category, Course, Lesson, Status

class CourseService:

    def dict_to_course(data: dict[str, Any]) -> Course:
        course = Course(
            name=data["name"],
            category=Category[data["category"].upper()],
            status=Status[data["status"].upper()]
        )
        
        if "lessons" in data:
            for lesson_data in data["lessons"]:
                lesson = Lesson(
                    name=lesson_data["name"],
                    youtube_url=lesson_data["youtube_url"]
                )
                course.lessons.append(lesson)
        
        return course

    @staticmethod
    def get_all() -> List[Course]:
        return Course.query.all()

    @staticmethod
    def get_by_id(id: int) -> Course:
        return Course.query.get_or_404(id)

    @staticmethod
    def create(data: Dict[str, Any]) -> Course:
        course = CourseService.dict_to_course(data)
        db_session = Course.query.session
        db_session.add(course)
        
        try:
            db_session.commit()
        except Exception as e:
            db_session.rollback()
            raise e
            
        return course

    @staticmethod
    def update(id: int, data: Dict[str, Any]) -> Course:
        course = CourseService.get_by_id(id)
        if not course:
            raise Exception(f"Course with ID {id} not found")
        
        temp_course: Course = CourseService.dict_to_course(data)
        
        db_session = Course.query.session
        
        if temp_course.name is not None:
            course.name = temp_course.name
        
        if temp_course.category is not None:
            course.category = temp_course.category
        
        if temp_course.status is not None:
            course.status = temp_course.status
        
        if temp_course.lessons:
            existing_lessons = {lesson.id: lesson for lesson in course.lessons}
            
            submitted_lesson_ids = {
                lesson.id for lesson in temp_course.lessons 
                if lesson.id is not None
            }
            
            lesson_ids_to_remove = set(existing_lessons.keys()) - submitted_lesson_ids
            for lesson_id in lesson_ids_to_remove:
                lesson = existing_lessons[lesson_id]
                course.lessons.remove(lesson)
                db_session.delete(lesson)
            
            for temp_lesson in temp_course.lessons:
                if temp_lesson.id is not None and temp_lesson.id in existing_lessons:
                    lesson = existing_lessons[temp_lesson.id]
                    if temp_lesson.name is not None:
                        lesson.name = temp_lesson.name
                    if temp_lesson.youtube_url is not None:
                        lesson.youtube_url = temp_lesson.youtube_url
                else:
                    new_lesson = Lesson(
                        name=temp_lesson.name,
                        youtube_url=temp_lesson.youtube_url,
                        course=course
                    )
                    course.lessons.append(new_lesson)
                    db_session.add(new_lesson)
        
        try:
            db_session.commit()
        except Exception as e:
            db_session.rollback()
            raise e
        
        return course

    @staticmethod
    def delete(id: int) -> bool:
        course = CourseService.get_by_id(id)
        print(course)
        db_session = Course.query.session
        db_session.delete(course)
        db_session.commit()
        return True
