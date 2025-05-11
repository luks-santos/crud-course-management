import pytest
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))


@pytest.fixture
def app():
    from crud_flask import app

    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "TEST_DB_URI", "sqlite:///:memory:"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "test_secret_key"

    with app.app_context():
        yield app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture(autouse=True)
def clear_mock_calls():
    from unittest.mock import Mock

    yield

    for obj in globals().values():
        if isinstance(obj, Mock):
            obj.reset_mock()

@pytest.fixture(autouse=True)
def app_context(app):
    with app.app_context():
        yield