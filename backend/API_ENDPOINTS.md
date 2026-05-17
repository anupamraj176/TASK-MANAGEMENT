# Task Management — API Endpoints Reference

**Base URL:** `http://localhost:5000` (local) or your deployed URL  
**Swagger Docs:** `GET /api/docs`

---

## 1. Health Check

| # | Method | Endpoint | Auth |
|---|--------|----------|------|
| 1 | `GET` | `/health` | ❌ None |

**200 Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2026-05-17T10:00:00.000Z"
}
```

---

## 2. Auth Endpoints (`/api/auth`)

| # | Method | Endpoint | Auth |
|---|--------|----------|------|
| 1 | `POST` | `/api/auth/signup` | ❌ None |
| 2 | `POST` | `/api/auth/login` | ❌ None |
| 3 | `POST` | `/api/auth/logout` | ❌ None |
| 4 | `POST` | `/api/auth/verify-email` | ❌ None |
| 5 | `POST` | `/api/auth/forgot-password` | ❌ None |
| 6 | `POST` | `/api/auth/reset-password/:token` | ❌ None |
| 7 | `GET`  | `/api/auth/check-auth` | 🔒 JWT Cookie |
| 8 | `PUT`  | `/api/auth/profile` | 🔒 JWT Cookie |

### 2.1 `POST /api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "role": "user"          // "user" | "admin"
}
```

**201 Response (success):**
```json
{
  "success": true,
  "message": "User created successfully. Check your email for verification code.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "664e...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": false
  }
}
```

**400 Response (error):**
```json
{ "success": false, "message": "All fields are required" }
// or
{ "success": false, "message": "User already exists" }
```

---

### 2.2 `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePass123",
  "role": "user"           // optional — validates role match
}
```

**200 Response (success):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "664e...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true,
    "profileImage": "https://...",
    "bio": "Developer",
    "phoneNumber": "+1234567890",
    "createdAt": "2026-05-10T12:00:00.000Z",
    "lastLogin": "2026-05-17T10:00:00.000Z"
  }
}
```

**400 Response (error):**
```json
{ "success": false, "message": "Invalid credentials" }
// or
{ "success": false, "message": "This account is not a admin" }
```

---

### 2.3 `POST /api/auth/logout`

**200 Response:**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

### 2.4 `POST /api/auth/verify-email`

**Request Body:**
```json
{ "code": "123456" }
```

**200 Response (success):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "664e...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true
  }
}
```

**400 Response (error):**
```json
{ "success": false, "message": "Invalid or expired verification code" }
```

---

### 2.5 `POST /api/auth/forgot-password`

**Request Body:**
```json
{ "email": "john@example.com" }
```

**200 Response:**
```json
{ "success": true, "message": "Password reset link sent to your email" }
```

**400 Response:**
```json
{ "success": false, "message": "User not found" }
```

---

### 2.6 `POST /api/auth/reset-password/:token`

**URL Param:** `:token` — the reset token from the email link

**Request Body:**
```json
{ "password": "newSecurePass456" }
```

**200 Response:**
```json
{ "success": true, "message": "Password reset successfully" }
```

**400 Response:**
```json
{ "success": false, "message": "Invalid or expired reset token" }
```

---

### 2.7 `GET /api/auth/check-auth` 🔒

**200 Response:**
```json
{
  "success": true,
  "user": {
    "_id": "664e...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true,
    "profileImage": "https://...",
    "bio": "Developer",
    "phoneNumber": "+1234567890"
  }
}
```

**401 Response:**
```json
{ "success": false, "message": "Unauthorized" }
```

---

### 2.8 `PUT /api/auth/profile` 🔒

**Request Body (all optional):**
```json
{
  "name": "John Updated",
  "profileImage": "https://cloudinary.com/...",
  "bio": "Senior Developer",
  "phoneNumber": "+9876543210"
}
```

**200 Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "664e...",
    "name": "John Updated",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true,
    "profileImage": "https://cloudinary.com/...",
    "bio": "Senior Developer",
    "phoneNumber": "+9876543210"
  }
}
```

---

## 3. Task Endpoints (`/api/tasks`) 🔒

> All task endpoints require JWT authentication via cookie.

| # | Method | Endpoint | Access |
|---|--------|----------|--------|
| 1 | `GET`    | `/api/tasks` | Admin → all tasks; User → own tasks |
| 2 | `POST`   | `/api/tasks` | Authenticated |
| 3 | `GET`    | `/api/tasks/:id` | Owner or Admin |
| 4 | `PUT`    | `/api/tasks/:id` | Owner or Admin |
| 5 | `DELETE` | `/api/tasks/:id` | Owner or Admin |
| 6 | `GET`    | `/api/tasks/:id/documents/:docId` | Owner or Admin |

### 3.1 `GET /api/tasks`

**Query Parameters:**
| Param | Type | Values | Default |
|-------|------|--------|---------|
| `page` | int | ≥ 1 | 1 |
| `limit` | int | ≥ 1 | 10 |
| `status` | string | `todo`, `in-progress`, `done` | — |
| `priority` | string | `low`, `medium`, `high` | — |
| `search` | string | title regex search | — |
| `dueDateFrom` | ISO date | `2026-01-01` | — |
| `dueDateTo` | ISO date | `2026-12-31` | — |
| `sortBy` | string | `dueDate`, `priority`, `createdAt` | `createdAt` |
| `sortOrder` | string | `asc`, `desc` | `desc` |

**200 Response:**
```json
{
  "data": [
    {
      "_id": "665a...",
      "title": "Fix login bug",
      "description": "Users can't login on Safari",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-05-20T00:00:00.000Z",
      "assignedTo": {
        "_id": "664e...",
        "name": "John Doe",
        "email": "john@example.com",
        "profileImage": "https://..."
      },
      "createdBy": "664e...",
      "attachedDocuments": [
        {
          "_id": "665b...",
          "fileName": "specs.pdf",
          "url": "https://res.cloudinary.com/.../specs.pdf",
          "downloadUrl": "https://res.cloudinary.com/.../fl_attachment/specs.pdf",
          "publicId": "task_docs/specs",
          "uploadedAt": "2026-05-15T08:00:00.000Z"
        }
      ],
      "createdAt": "2026-05-15T08:00:00.000Z",
      "updatedAt": "2026-05-16T12:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

### 3.2 `POST /api/tasks`

**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Task title |
| `description` | ❌ | Task description |
| `status` | ❌ | `todo` (default), `in-progress`, `done` |
| `priority` | ❌ | `low`, `medium` (default), `high` |
| `dueDate` | ❌ | ISO date string |
| `assignedTo` | ❌ | User ID (admin only) |
| `documents` | ❌ | Up to 3 PDF files |

**201 Response:**
```json
{
  "success": true,
  "task": {
    "_id": "665a...",
    "title": "Fix login bug",
    "description": "Users can't login on Safari",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-05-20T00:00:00.000Z",
    "assignedTo": {
      "_id": "664e...",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "https://..."
    },
    "createdBy": "664e...",
    "attachedDocuments": [],
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

---

### 3.3 `GET /api/tasks/:id`

**200 Response:**
```json
{
  "success": true,
  "task": { /* full task object (same shape as above) */ }
}
```

**403 Response:**
```json
{ "success": false, "message": "Access denied" }
```

**404 Response:**
```json
{ "success": false, "message": "Task not found" }
```

---

### 3.4 `PUT /api/tasks/:id`

**Content-Type:** `multipart/form-data`

**Form Fields (all optional):**
| Field | Description |
|-------|-------------|
| `title` | New title |
| `description` | New description |
| `status` | `todo`, `in-progress`, `done` |
| `priority` | `low`, `medium`, `high` |
| `dueDate` | ISO date string |
| `assignedTo` | User ID (admin only) |
| `replaceDocuments` | `"true"` to remove all existing docs first |
| `removeDocumentIds` | JSON array of doc IDs to remove selectively |
| `documents` | New PDF files to add (up to 3 total) |

**200 Response:**
```json
{
  "success": true,
  "task": { /* updated full task object */ }
}
```

---

### 3.5 `DELETE /api/tasks/:id`

**200 Response:**
```json
{ "success": true, "message": "Task deleted successfully" }
```

---

### 3.6 `GET /api/tasks/:id/documents/:docId`

**302 Response:** Redirects to the Cloudinary download URL.

**404 Response:**
```json
{ "success": false, "message": "Document not found" }
```

---

## 4. User Endpoints (`/api/users`) 🔒

| # | Method | Endpoint | Access |
|---|--------|----------|--------|
| 1 | `GET`    | `/api/users` | 🔐 Admin only |
| 2 | `POST`   | `/api/users` | 🔐 Admin only |
| 3 | `GET`    | `/api/users/:id` | Admin or Self |
| 4 | `PUT`    | `/api/users/:id` | Admin or Self |
| 5 | `DELETE` | `/api/users/:id` | 🔐 Admin only |

### 4.1 `GET /api/users` 🔐

**Query Parameters:**
| Param | Type | Values | Default |
|-------|------|--------|---------|
| `page` | int | ≥ 1 | 1 |
| `limit` | int | ≥ 1 | 10 |
| `role` | string | `user`, `admin` | — |
| `search` | string | name/email regex | — |
| `sortBy` | string | `name`, `createdAt` | `createdAt` |
| `sortOrder` | string | `asc`, `desc` | `desc` |

**200 Response:**
```json
{
  "data": [
    {
      "_id": "664e...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "profileImage": "https://...",
      "bio": "Developer",
      "phoneNumber": "+1234567890",
      "createdAt": "2026-05-10T12:00:00.000Z",
      "lastLogin": "2026-05-17T10:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

### 4.2 `POST /api/users` 🔐

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePass789",
  "role": "user"              // optional, default "user"
}
```

**201 Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "664f...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "user",
    "isVerified": false,
    "createdAt": "2026-05-17T10:00:00.000Z"
  }
}
```

**400 Response:**
```json
{ "success": false, "message": "User already exists" }
```

---

### 4.3 `GET /api/users/:id`

**200 Response:**
```json
{
  "success": true,
  "user": {
    "_id": "664e...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true,
    "profileImage": "https://...",
    "bio": "Developer",
    "phoneNumber": "+1234567890",
    "createdAt": "2026-05-10T12:00:00.000Z",
    "lastLogin": "2026-05-17T10:00:00.000Z"
  }
}
```

**403 Response:**
```json
{ "success": false, "message": "Access denied. You can only view your own profile." }
```

---

### 4.4 `PUT /api/users/:id`

**Request Body (all optional):**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "role": "admin",             // admin-only field
  "profileImage": "https://...",
  "bio": "Senior Dev",
  "phoneNumber": "+9876543210",
  "isVerified": true           // admin-only field
}
```

**200 Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": { /* full user object without password */ }
}
```

---

### 4.5 `DELETE /api/users/:id` 🔐

**200 Response:**
```json
{ "success": true, "message": "User deleted successfully" }
```

**404 Response:**
```json
{ "success": false, "message": "User not found" }
```

---

## 5. Admin Endpoints (`/api/admin`) 🔐

> All admin endpoints require JWT auth **+** admin role.

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | `GET` | `/api/admin/stats` | Dashboard stats |
| 2 | `GET` | `/api/admin/statistics` | User statistics |
| 3 | `GET` | `/api/admin/users` | Get all users |
| 4 | `GET` | `/api/admin/users/search` | Search users |
| 5 | `GET` | `/api/admin/users/:id` | Get user details |
| 6 | `PUT` | `/api/admin/users/:id/role` | Update user role |
| 7 | `DELETE` | `/api/admin/users/:id` | Delete user |
| 8 | `GET` | `/api/admin/admins` | Get all admins |

### 5.1 `GET /api/admin/stats`

**200 Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 45,
    "totalAdmins": 3,
    "totalRegistered": 48,
    "verifiedUsers": 40,
    "unverifiedUsers": 8
  }
}
```

---

### 5.2 `GET /api/admin/statistics`

**200 Response:**
```json
{
  "success": true,
  "statistics": {
    "totalUsers": 48,
    "verifiedUsers": 40,
    "unverifiedUsers": 8,
    "activeUsers": 32,
    "verificationRate": "83.33%"
  }
}
```

---

### 5.3 `GET /api/admin/users`

**200 Response:**
```json
{
  "success": true,
  "count": 45,
  "users": [
    {
      "_id": "664e...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "createdAt": "2026-05-10T12:00:00.000Z",
      "lastLogin": "2026-05-17T10:00:00.000Z"
    }
  ]
}
```

---

### 5.4 `GET /api/admin/users/search`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `query` | string | Search by name or email |
| `role` | string | Filter by `user` or `admin` |

**200 Response:**
```json
{
  "success": true,
  "count": 5,
  "users": [ /* array of user objects */ ]
}
```

---

### 5.5 `GET /api/admin/users/:id`

**200 Response:**
```json
{
  "success": true,
  "user": { /* full user object without password */ }
}
```

**404 Response:**
```json
{ "success": false, "message": "User not found" }
```

---

### 5.6 `PUT /api/admin/users/:id/role`

**Request Body:**
```json
{ "role": "admin" }     // "user" | "admin"
```

**200 Response:**
```json
{
  "success": true,
  "message": "User role updated to admin",
  "user": { /* updated user object */ }
}
```

**400 Response:**
```json
{ "success": false, "message": "Invalid role. Must be \"user\" or \"admin\"" }
```

---

### 5.7 `DELETE /api/admin/users/:id`

**200 Response:**
```json
{ "success": true, "message": "User deleted successfully" }
```

**403 Response:**
```json
{ "success": false, "message": "Cannot delete another admin" }
```

---

### 5.8 `GET /api/admin/admins`

**200 Response:**
```json
{
  "success": true,
  "count": 3,
  "admins": [
    {
      "_id": "664e...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "isVerified": true,
      "createdAt": "2026-05-01T00:00:00.000Z"
    }
  ]
}
```

---

## 6. Upload Endpoint (`/api/upload`)

| # | Method | Endpoint | Auth |
|---|--------|----------|------|
| 1 | `POST` | `/api/upload` | ❌ None |

**Content-Type:** `multipart/form-data`  
**Field:** `document` (single PDF file)

**200 Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "fileName": "report.pdf",
    "fileSize": 204800,
    "mimeType": "application/pdf",
    "cloudinaryUrl": "https://res.cloudinary.com/.../report.pdf",
    "downloadUrl": "https://res.cloudinary.com/.../fl_attachment/report.pdf",
    "publicId": "task_docs/report",
    "uploadedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

**400 Response:**
```json
{ "error": "No file provided" }
```

---

## Summary

| Category | Count | Base Path |
|----------|-------|-----------|
| Health | 1 | `/health` |
| Auth | 8 | `/api/auth` |
| Tasks | 6 | `/api/tasks` |
| Users | 5 | `/api/users` |
| Admin | 8 | `/api/admin` |
| Upload | 1 | `/api/upload` |
| **Total** | **29** | |
