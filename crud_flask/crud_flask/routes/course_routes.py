from typing import Dict, List, Any, Tuple, Union
from flask import Blueprint, request, jsonify, Response
from ..services.course_service import CourseService
from ..models import db, Category, Status


bp = Blueprint("courses", __name__, url_prefix="/api/courses")

@bp.route("", methods=["GET"])
def get_courses() -> Response:
    courses = CourseService.get_all()
    result = []

    for course in courses:
        course_data = {
            "id": course.id,
            "name": course.name,
            "category": course.category.value,
            "status": course.status.value,
            "lessons": [
                {
                    "id": lesson.id,
                    "name": lesson.name,
                    "youtube_url": lesson.youtube_url,
                }
                for lesson in course.lessons
            ],
        }
        result.append(course_data)

    return jsonify(result)


@bp.route("/<int:id>", methods=["GET"])
def get_course(id: int) -> Response:
    course = CourseService.get_by_id(id)

    course_data = {
        "id": course.id,
        "name": course.name,
        "category": course.category.value,
        "status": course.status.value,
        "lessons": [
            {"id": lesson.id, "name": lesson.name, "youtube_url": lesson.youtube_url}
            for lesson in course.lessons
        ],
    }

    return jsonify(course_data)


@bp.route("", methods=["POST"])
def create_course() -> Tuple[Response, int]:
    data = request.get_json()

    try:
        course = CourseService.create(data)
        response_data = {
            "id": course.id,
            "name": course.name,
            "category": course.category.value,
            "status": course.status.value,
            "lessons": [
                {
                    "id": lesson.id,
                    "name": lesson.name,
                    "youtube_url": lesson.youtube_url,
                }
                for lesson in course.lessons
            ],
        }

        return jsonify(response_data), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@bp.route("/<int:id>", methods=["PUT"])
def update_course(id: int) -> Response:
    data = request.get_json()
    try:
        course = CourseService.update(id, data)

        response_data = {
            "id": course.id,
            "name": course.name,
            "category": course.category.value,
            "status": course.status.value,
            "lessons": [
                {
                    "id": lesson.id,
                    "name": lesson.name,
                    "youtube_url": lesson.youtube_url,
                }
                for lesson in course.lessons
            ],
        }

        return jsonify(response_data)

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@bp.route("/<int:id>", methods=["DELETE"])
def delete_course(id: int) -> Tuple[Response, int]:
    try:
        CourseService.delete(id)
        return jsonify({"message": "Curso excluído com sucesso"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
