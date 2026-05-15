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
