from typing import Tuple
from flask import Blueprint, request, jsonify, Response
from ..services.course_service import CourseService 


class CourseRoutes:
    
    def __init__(self, course_service: CourseService):
        self.course_service = course_service
        self.bp = Blueprint("courses", __name__, url_prefix="/api/courses")
        self._register_routes()
    
    def _register_routes(self):
        self.bp.route("", methods=["GET"])(self.get_all)
        self.bp.route("/paginated", methods=["GET"])(self.get_all_paginated)
        self.bp.route("/<int:id>", methods=["GET"])(self.get_by_id)
        self.bp.route("", methods=["POST"])(self.create)
        self.bp.route("/<int:id>", methods=["PUT"])(self.update)
        self.bp.route("/<int:id>", methods=["DELETE"])(self.delete_by_id)
    
    def get_all(self) -> Response:
        return jsonify(self.course_service.get_all())

    def get_all_paginated(self) -> Response:
        try:
            page = int(request.args.get("page", 1))
            per_page = int(request.args.get("per_page", 10))
            return jsonify(self.course_service.get_all_paginated(page, per_page))
        except ValueError:
            return jsonify({"error": "Invalid pagination parameters"}), 400

    def get_by_id(self, id: int) -> Response:
        return jsonify(self.course_service.get_by_id(id))

    def create(self) -> Response:
        try:
            data = request.get_json()
            return jsonify(self.course_service.create(data)), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    def update(self, id: int) -> Response:
        try:
            data = request.get_json()
            return jsonify(self.course_service.update(id, data))
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    def delete_by_id(self, id: int) -> Response:
        try:
            self.course_service.delete_by_id(id)
            return jsonify({"message": "Course deleted"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
