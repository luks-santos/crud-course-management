import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from crud_flask.routes.course_routes import CourseRoutes
from crud_flask.services.course_service import CourseService
from crud_flask.models.models import Course, Lesson, db

app = Flask(__name__)

app.config["SECRET_KEY"] = "dev"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///crud_flask.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SQLALCHEMY_ECHO'] = True

CORS(app)

db.init_app(app)
Migrate(app, db)

with app.app_context():
    def get_db_session():
        return db.session
        
    course_service = CourseService(
        session_factory=get_db_session,
        course_model=Course,
        lesson_model=Lesson,
    )
    course_routes = CourseRoutes(course_service)
    
    app.register_blueprint(course_routes.bp)


if __name__ == "__main__":
    app.run(debug=True)
