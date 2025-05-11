import pytest
from unittest.mock import Mock, MagicMock, patch
from crud_flask.services.course_service import CourseService
from crud_flask.models.models import Course, Lesson, Category, Status
from datetime import datetime
from test_constants import TestConstants  # Import the new constants class


class TestCourseService:
    def setup_method(self):
        self.mock_session = Mock()
        self.mock_session_factory = Mock(return_value=self.mock_session)

        self.course_service = CourseService(
            session_factory=self.mock_session_factory,
            course_model=Course,
            lesson_model=Lesson
        )

        self.mock_course = Mock(spec=Course)
        self.mock_course.id = TestConstants.COURSE_ID
        self.mock_course.name = TestConstants.COURSE_NAME
        self.mock_course.description = TestConstants.COURSE_DESCRIPTION
        self.mock_course.category = TestConstants.COURSE_CATEGORY
        self.mock_course.status = TestConstants.COURSE_STATUS

        self.mock_course.to_dict = Mock(return_value=TestConstants.get_course_dict_response())
        

    def teardown_method(self):
        self.mock_session.close.reset_mock()

    # Get TESTS
    def test_get_all_success(self):
        # Arrange
        mock_courses = [self.mock_course]
        self.mock_session.query.return_value.all.return_value = mock_courses
        
        # Act
        result = self.course_service.get_all()
        
        # Assert
        assert len(result) == 1
        assert result[0]["id"] == TestConstants.COURSE_ID
        assert result[0]["name"] == TestConstants.COURSE_NAME
        self.mock_session_factory.assert_called_once()
        self.mock_session.query.assert_called_once_with(Course)
        self.mock_session.close.assert_called_once()

    def test_get_all_empty_result(self):
        # Arrange
        self.mock_session.query.return_value.all.return_value = []
        
        # Act
        result = self.course_service.get_all()
        
        # Assert
        assert result == []
        self.mock_session_factory.assert_called_once()
        self.mock_session.query.assert_called_once_with(Course)
        self.mock_session.close.assert_called_once()

    def test_get_all_exception(self):
        # Arrange
        self.mock_session.query.side_effect = Exception(TestConstants.ERROR_DATABASE)
        
        # Act & Assert
        expected_error = TestConstants.get_error_message("fetch_all_courses", error=TestConstants.ERROR_DATABASE)
        with pytest.raises(Exception, match=expected_error):
            self.course_service.get_all()
        
        self.mock_session.close.assert_called_once()

    def test_get_by_id_success(self):
        # Arrange
        course_id = TestConstants.COURSE_ID
        self.mock_session.query.return_value.get.return_value = self.mock_course
        
        # Act
        result = self.course_service.get_by_id(course_id)
        
        # Assert
        assert result["id"] == course_id
        assert result["name"] == TestConstants.COURSE_NAME
        self.mock_session.query.assert_called_once_with(Course)
        self.mock_session.query.return_value.get.assert_called_once_with(course_id)
        self.mock_session.close.assert_called_once()

    def test_get_by_id_not_found(self):
        # Arrange
        course_id = TestConstants.NON_EXISTENT_COURSE_ID
        self.mock_session.query.return_value.get.return_value = None
        
        # Act & Assert
        expected_error = TestConstants.get_error_message("course_not_found", id=course_id)
        with pytest.raises(Exception, match=expected_error):
            self.course_service.get_by_id(course_id)
        
        self.mock_session.close.assert_called_once()

    # Create TESTS
    def test_create_success(self):
        # Arrange
        course_data = TestConstants.get_complete_course_data(include_id=False)

        mock_created_course = Mock(spec=Course)
        mock_created_course.to_dict.return_value = TestConstants.get_course_dict_response()
        
        self.mock_session_factory.return_value = self.mock_session
    
        with patch.object(CourseService, '_CourseService__dict_to_course', return_value=mock_created_course):
            # Act
            result = self.course_service.create(course_data)
        
        # Assert
        self.mock_session.add.assert_called_once()
        self.mock_session.commit.assert_called_once()
        self.mock_session.close.assert_called_once()
        
        assert result["name"] == TestConstants.COURSE_NAME
        assert result["category"] == TestConstants.COURSE_CATEGORY
        assert "id" in result
        assert "created_at" in result

    def test_create_with_invalid_category(self):
        # Arrange
        invalid_data = TestConstants.get_complete_course_data(include_id=False)
        invalid_data["category"] = TestConstants.INVALID_CATEGORY

        mock_created_course = Mock(spec=Course)
        mock_created_course.to_dict.return_value = TestConstants.get_course_dict_response()
        
        with patch('crud_flask.services.course_service.Course', return_value=mock_created_course):
            # Act & Assert
            with pytest.raises(Exception):
                self.course_service.create(invalid_data)
       
                self.mock_session.rollback.assert_called_once()
                self.mock_session.close.assert_called_once()

    def test_create_with_invalid_status(self):
        # Arrange
        invalid_data = TestConstants.get_complete_course_data(include_id=False)
        invalid_data["status"] = "INVALID_STATUS"

        mock_created_course = Mock(spec=Course)
        mock_created_course.to_dict.return_value = TestConstants.get_course_dict_response()
        
        with patch('crud_flask.services.course_service.Course', return_value=mock_created_course):
            # Act & Assert
            with pytest.raises(Exception):
                self.course_service.create(invalid_data)
       
                self.mock_session.rollback.assert_called_once()
                self.mock_session.close.assert_called_once()

    # Update TESTS
    def test_update_success(self):
        # Arrange
        course_id = TestConstants.COURSE_ID
        update_data = TestConstants.get_update_data()
        
        existing_course = Mock(spec=Course)
        existing_course.id = course_id
        existing_course.lessons = []
        existing_course.to_dict.return_value = {"id": course_id, "name": TestConstants.UPDATED_COURSE_NAME}
        
        self.mock_session.query.return_value.get.return_value = existing_course
        
        # Act
        self.course_service.update(course_id, update_data)
        
        # Assert
        assert existing_course.name == TestConstants.UPDATED_COURSE_NAME
        assert existing_course.description == TestConstants.UPDATED_COURSE_DESCRIPTION
        self.mock_session.commit.assert_called_once()
        self.mock_session.close.assert_called_once()

    def test_update_course_not_found(self):
        # Arrange
        course_id = TestConstants.NON_EXISTENT_COURSE_ID
        update_data = TestConstants.get_update_data(fields=["name"])
        self.mock_session.query.return_value.get.return_value = None
        
        # Act & Assert
        expected_error = TestConstants.get_error_message("course_not_found", id=course_id)
        with pytest.raises(Exception, match=expected_error):
            self.course_service.update(course_id, update_data)
        
        self.mock_session.rollback.assert_called_once()
        self.mock_session.close.assert_called_once()

    def test_update_with_lessons_add_new(self):
        # Arrange
        course_id = TestConstants.COURSE_ID
        existing_lesson = Mock(spec=Lesson)
        existing_lesson.id = TestConstants.LESSON_ID
        existing_lesson.name = TestConstants.LESSON_NAME
        
        existing_course = Mock(spec=Course)
        existing_course.id = course_id
        existing_course.lessons = Mock()
        existing_course.lessons.__iter__ = Mock(return_value=iter([existing_lesson]))
        existing_course.lessons.append = Mock()
        existing_course.to_dict.return_value = {"id": course_id}
        
        update_data = TestConstants.get_lessons_update_data()
        
        self.mock_session.query.return_value.get.return_value = existing_course

        with patch.object(self.course_service, '_CourseService__dict_to_course') as mock_dict_to_course:
            temp_course_mock = Mock(spec=Course)
            temp_course_mock.lessons = []
            for lesson_data in update_data.get("lessons", []):
                lesson_mock = Mock(spec=Lesson)
                lesson_mock.id = lesson_data.get("id")
                lesson_mock.name = lesson_data.get("name")
                lesson_mock.youtube_url = lesson_data.get("youtube_url")
                temp_course_mock.lessons.append(lesson_mock)
            
            mock_dict_to_course.return_value = temp_course_mock
            
            with patch('crud_flask.services.course_service.Lesson') as mock_lesson_class:
                # Configure what the constructor should return
                new_lesson_instance = Mock(spec=Lesson)
                new_lesson_instance.name = TestConstants.NEW_LESSON_NAME
                new_lesson_instance.youtube_url = TestConstants.NEW_LESSON_YOUTUBE_URL
                mock_lesson_class.return_value = new_lesson_instance
                
                # Act
                self.course_service.update(course_id, update_data)
                
                # Assert
                # Verify Lesson constructor was called with correct parameters
                mock_lesson_class.assert_called_once_with(
                    name=TestConstants.NEW_LESSON_NAME,
                    youtube_url=TestConstants.NEW_LESSON_YOUTUBE_URL,
                    course=existing_course
                )
                
                # Verify new lesson was added to list
                existing_course.lessons.append.assert_called_once_with(new_lesson_instance)
                
                # Verify session.add was called with new lesson
                self.mock_session.add.assert_called_once_with(new_lesson_instance)
                self.mock_session.commit.assert_called_once()
                self.mock_session.close.assert_called_once()

    def test_update_with_lessons_modify_existing(self):
        """Test course update by modifying existing lesson"""
        # Arrange
        course_id = TestConstants.COURSE_ID
        existing_lesson = Mock(spec=Lesson)
        existing_lesson.id = TestConstants.LESSON_ID
        existing_lesson.name = TestConstants.LESSON_NAME
        existing_lesson.youtube_url = TestConstants.LESSON_YOUTUBE_URL
        
        existing_course = Mock(spec=Course)
        existing_course.id = course_id
        existing_course.lessons = Mock()
        existing_course.lessons.__iter__ = Mock(return_value=iter([existing_lesson]))
        existing_course.lessons.append = Mock()
        existing_course.to_dict.return_value = {"id": course_id}
        
        update_data = {
            "lessons": [
                {
                    "id": TestConstants.LESSON_ID, 
                    "name": "Updated Lesson Name", 
                    "youtube_url": "updated_url"
                }
            ]
        }
        
        self.mock_session.query.return_value.get.return_value = existing_course
        
        # Act
        self.course_service.update(course_id, update_data)
        
        # Assert
        # Verify existing lesson was updated
        assert existing_lesson.name == "Updated Lesson Name"
        assert existing_lesson.youtube_url == "updated_url"
        self.mock_session.commit.assert_called_once()
        self.mock_session.close.assert_called_once()

    # DELETE TESTS
    def test_delete_by_id_success(self):
        # Arrange
        course_id = TestConstants.COURSE_ID
        self.mock_session.query.return_value.get.return_value = self.mock_course
        
        # Act
        result = self.course_service.delete_by_id(course_id)
        
        # Assert
        assert result is True
        self.mock_session.delete.assert_called_once_with(self.mock_course)
        self.mock_session.commit.assert_called_once()
        self.mock_session.close.assert_called_once()

    def test_delete_by_id_not_found(self):
        # Arrange
        course_id = TestConstants.NON_EXISTENT_COURSE_ID
        self.mock_session.query.return_value.get.return_value = None
        
        # Act & Assert
        expected_error = TestConstants.get_error_message("course_not_found", id=course_id)
        with pytest.raises(Exception, match=expected_error):
            self.course_service.delete_by_id(course_id)
        
        self.mock_session.rollback.assert_called_once()
        self.mock_session.close.assert_called_once()

    # PAGINATION TESTS
    def test_get_all_paginated_success(self):
        # Arrange
        page = TestConstants.DEFAULT_PAGE
        per_page = TestConstants.DEFAULT_PAGE_SIZE
        mock_paginate = Mock()
        mock_paginate.items = [self.mock_course]
        
        self.mock_session.query.return_value.paginate.return_value = mock_paginate
        self.mock_session.query.return_value.count.return_value = 1
        
        # Act
        result = self.course_service.get_all_paginated(page, per_page)
        
        # Assert
        assert result["pageIndex"] == page
        assert result["pageSize"] == per_page
        assert result["totalCount"] == 1
        assert result["totalPages"] == 1
        assert result["canPreviousPage"] is False
        assert result["canNextPage"] is False
        assert len(result["data"]) == 1
        
        self.mock_session.query.assert_called_with(Course)
        self.mock_session.query.return_value.paginate.assert_called_once_with(
            page=page, per_page=per_page, error_out=False
        )
        self.mock_session.close.assert_called_once()

    def test_get_all_paginated_with_multiple_pages(self):
        # Arrange
        page = 2
        per_page = 10
        total_count = 25
        mock_paginate = Mock()
        mock_paginate.items = [self.mock_course]
        
        self.mock_session.query.return_value.paginate.return_value = mock_paginate
        self.mock_session.query.return_value.count.return_value = total_count
        
        # Act
        result = self.course_service.get_all_paginated(page, per_page)
        
        # Assert
        assert result["pageIndex"] == page
        assert result["pageSize"] == per_page
        assert result["totalCount"] == total_count
        assert result["totalPages"] == 3  
        assert result["canPreviousPage"] is True
        assert result["canNextPage"] is True
        
        self.mock_session.close.assert_called_once()

    # DICT CONVERSION TESTS
    def test_dict_to_course_with_lessons(self):
        # Arrange
        course_data = TestConstants.get_complete_course_data()
        
        # Act 
        course_obj = self.course_service._CourseService__dict_to_course(course_data)
        
        # Assert 
        assert isinstance(course_obj, Course)
        assert course_obj.name == TestConstants.COURSE_NAME
        assert course_obj.category == Category.BACKEND
        assert course_obj.status == Status.ACTIVE
        assert len(course_obj.lessons) == 1
        assert course_obj.lessons[0].name == TestConstants.LESSON_NAME
        assert course_obj.lessons[0].youtube_url == TestConstants.LESSON_YOUTUBE_URL

    def test_dict_to_course_without_lessons(self):
        # Arrange
        course_data = TestConstants.get_complete_course_data()
        course_data["lessons"] = []
        # Act 
        course_obj = self.course_service._CourseService__dict_to_course(course_data)
        
        assert isinstance(course_obj, Course)
        assert course_obj.name == TestConstants.COURSE_NAME
        assert course_obj.lessons == []

    # ERROR HANDLING TESTS
    def test_session_error_handling(self):
        # Arrange
        self.mock_session.query.side_effect = Exception("Database connection failed")
        
        # Act & Assert
        with pytest.raises(Exception):
            self.course_service.get_all()
        
        # Verify session close is called even when error occurs
        self.mock_session.close.assert_called_once()