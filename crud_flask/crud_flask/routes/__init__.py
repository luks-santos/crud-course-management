from flask import Blueprint
from .course_routes import bp as course_bp

bp = Blueprint("api", __name__)

bp.register_blueprint(course_bp)
