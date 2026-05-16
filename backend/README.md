# Task Management Backend

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB
- Cloudinary Account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Update with your credentials

3. Start the server:
```bash
npm run dev
```

## Folder Structure

```
backend/
├── config/           # Configuration files (db, cloudinary, etc.)
├── controllers/      # Route handlers
├── middleware/       # Custom middleware (auth, upload, etc.)
├── models/          # Database models (User, Task, etc.)
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── .env             # Environment variables
├── server.js        # Entry point
└── package.json     # Dependencies
```

## Testing

```bash
npm run test
```

## API Documentation

- Swagger UI: `http://localhost:5000/api/docs`
- Postman collection: `backend/POSTMAN_COLLECTION.json`

## Docker

From repo root:
```bash
docker-compose up --build
```

Backend will be available at: `http://localhost:5000`

## Task APIs (Phase 4)

Base: `http://localhost:5000/api/tasks`

- `POST /` create task (supports up to 3 PDF attachments via `documents` form-data)
- `GET /` list tasks with filtering, sorting, pagination
- `GET /:id` task detail (ownership enforced)
- `PUT /:id` update task + optional attachment add/replace
- `DELETE /:id` delete task + cleanup attachments
- `GET /:id/documents/:docId` download a specific attachment
