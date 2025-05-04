import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from .routes import bp as api_bp
from .models.models import db

app = Flask(__name__)

app.config["SECRET_KEY"] = "dev"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///crud_flask.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SQLALCHEMY_ECHO'] = True

CORS(app)

db.init_app(app)
Migrate(app, db)

app.register_blueprint(api_bp)


if __name__ == "__main__":
    app.run(debug=True)
