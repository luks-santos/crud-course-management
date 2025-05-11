from datetime import datetime
from crud_flask.models.models import Category, Status


class TestConstants:
    # Course test data
    COURSE_ID = 1
    COURSE_NAME = "Test Course"
    COURSE_DESCRIPTION = "Test description"
    COURSE_CATEGORY = Category.BACKEND.value
    COURSE_STATUS = Status.ACTIVE.value
    UPDATED_COURSE_NAME = "Updated Name"
    UPDATED_COURSE_DESCRIPTION = "Updated description"
    NON_EXISTENT_COURSE_ID = 999
    
    # Lesson test data
    LESSON_ID = 1
    LESSON_NAME = "Lesson 1"
    LESSON_YOUTUBE_URL = "https://youtube.com/watch?v=test1"
    NEW_LESSON_NAME = "New Lesson"
    NEW_LESSON_YOUTUBE_URL = "new_url"
    UPDATED_LESSON_YOUTUBE_URL = "url1"
    
    # Pagination constants
    DEFAULT_PAGE = 1
    DEFAULT_PAGE_SIZE = 10
    
    # Test dates (formatted)
    FORMATTED_DATE = "2025-01-01T00:00:00"
    
    # Error messages
    ERROR_DATABASE = "Database error"
    ERROR_COURSE_NOT_FOUND = "Course with ID {id} not found"
    ERROR_FETCH_ALL_COURSES = "Error fetching all courses: {error}"
    
    # Invalid data
    INVALID_CATEGORY = "INVALID_CATEGORY"
    
    @classmethod
    def get_complete_course_data(cls, include_id=True):
        """
        Returns complete course data dictionary
        
        Args:
            include_id (bool): Whether to include ID in the data
            
        Returns:
            dict: Complete course data
        """
        data = {
            "name": cls.COURSE_NAME,
            "description": cls.COURSE_DESCRIPTION,
            "category": Category.BACKEND.name,
            "status": Status.ACTIVE.name,
            "lessons": [
                {
                    "id": cls.LESSON_ID,
                    "name": cls.LESSON_NAME,
                    "youtube_url": cls.LESSON_YOUTUBE_URL
                }
            ]
        }
        
        if include_id:
            data["id"] = cls.COURSE_ID
            
        return data
    
    @classmethod
    def get_course_dict_response(cls):
        """
        Returns course dictionary as it would be returned by to_dict()
        
        Returns:
            dict: Course dictionary response
        """
        return {
            "id": cls.COURSE_ID,
            "name": cls.COURSE_NAME,
            "description": cls.COURSE_DESCRIPTION,
            "category": cls.COURSE_CATEGORY,
            "status": cls.COURSE_STATUS,
            "created_at": cls.FORMATTED_DATE,
            "updated_at": cls.FORMATTED_DATE,
            "lessons": []
        }
    
    @classmethod
    def get_update_data(cls, fields=None):
        """
        Returns update data for course
        
        Args:
            fields (list): List of fields to include. If None, includes name and description
            
        Returns:
            dict: Update data
        """
        if fields is None:
            fields = ["name", "description"]
            
        data = {}
        if "name" in fields:
            data["name"] = cls.UPDATED_COURSE_NAME
        if "description" in fields:
            data["description"] = cls.UPDATED_COURSE_DESCRIPTION
            
        return data
    
    @classmethod
    def get_lessons_update_data(cls):
        """
        Returns lesson update data with existing and new lessons
        
        Returns:
            dict: Lessons update data
        """
        return {
            "lessons": [
                {
                    "id": cls.LESSON_ID, 
                    "name": cls.LESSON_NAME, 
                    "youtube_url": cls.UPDATED_LESSON_YOUTUBE_URL
                },
                {
                    "name": cls.NEW_LESSON_NAME, 
                    "youtube_url": cls.NEW_LESSON_YOUTUBE_URL
                }
            ]
        }
    
    @classmethod
    def get_error_message(cls, error_type, **kwargs):
        """
        Returns formatted error message
        
        Args:
            error_type (str): Type of error message to return
            **kwargs: Additional parameters for formatting
            
        Returns:
            str: Formatted error message
        """
        if error_type == "course_not_found":
            return cls.ERROR_COURSE_NOT_FOUND.format(id=kwargs.get("id", cls.NON_EXISTENT_COURSE_ID))
        elif error_type == "fetch_all_courses":
            return cls.ERROR_FETCH_ALL_COURSES.format(error=kwargs.get("error", cls.ERROR_DATABASE))
        return ""