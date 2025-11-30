# Todo App
A full-stack Todo application built with Django REST Framework (backend) and Next.js (frontend). Features UUID primary keys, title + description, CRUD operations, edit functionality, TanStack Query for data fetching, and Tailwind CSS for styling.

## Features
- Add, edit, delete, and toggle completion of todos.
- Each todo has:
    - id (UUID)
    - title
    - description
    - completed status
    - created_at timestamp
- React frontend with Next.js App Router
- Axios for HTTP requests
- TanStack Query for caching, fetching, and mutations
- Tailwind CSS for responsive styling
- Backend with Django REST Framework
- CORS enabled for cross-origin frontend requests

## Setup
- Clone the repository.
- Go into the project.
- You can run both backend and frontend by running:
```sh
docker-compose up
```
- Open http://localhost:3000 in your browser.
