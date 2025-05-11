# Course Management System

[![Backend CI](https://github.com/luks-santos/crud-react-flask/actions/workflows/backend.yml/badge.svg)](https://github.com/luks-santos/crud-react-flask/actions/workflows/backend.yml)

A full-stack course management application built with Flask (backend) and React (frontend).

## Features

- **Backend (Flask)**:

  - REST API for courses and lessons CRUD
  - PostgreSQL database
  - Automated tests
  - Database migrations (Alembic)
  - Relationship: 1 course -> N lessons

- **Frontend (React)**:
  - UI for managing courses
  - Course details view
  - YouTube video player
  - Pagination
  - UI with Chakra UI

## How to run

### Backend

```bash
# In crud_flask folder
make setup      # Initial setup
make dev        # Development
make logs       # View logs
```

### Frontend

```bash
# In crud_react folder
npm install
npm run dev
```

Backend will be at `http://localhost:5000` and frontend at `http://localhost:5173`

## Other commands

See `crud_flask/Makefile` for more backend commands
