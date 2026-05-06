# Stage 1

# Notification System REST API Design

## Base URL

```http
http://localhost:3000/api
```

---

# 1. Get All Notifications

## Endpoint

```http
GET /notifications
```

## Headers

```json
{
  "Authorization": "Bearer <token>"
}
```

## Response

```json
{
  "success": true,
  "notifications": [
    {
      "id": "101",
      "type": "Placement",
      "message": "Microsoft Hiring Drive",
      "isRead": false,
      "createdAt": "2026-05-06T10:30:00Z"
    }
  ]
}
```

---

# 2. Create Notification

## Endpoint

```http
POST /notifications
```

## Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

## Request Body

```json
{
  "type": "Placement",
  "message": "Amazon Hiring Drive"
}
```

## Response

```json
{
  "success": true,
  "message": "Notification created successfully"
}
```

---

# 3. Mark Notification As Read

## Endpoint

```http
PATCH /notifications/:id/read
```

## Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

# 4. Delete Notification

## Endpoint

```http
DELETE /notifications/:id
```

## Response

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

# 5. Get Priority Notifications

## Endpoint

```http
GET /notifications/priority?n=10
```

## Response

```json
{
  "success": true,
  "notifications": []
}
```

---

# Real-Time Notification Mechanism

The system will use WebSockets for real-time notification delivery.

## Flow

1. Client establishes WebSocket connection
2. Server pushes notifications instantly
3. Frontend updates UI without refresh
4. Read/unread states update dynamically

## Benefits

- Real-time updates
- Reduced API polling
- Better user experience
- Faster notification delivery



# Stage 2

# Database Design

## Selected Database

PostgreSQL is selected as the primary database for the notification system.

## Reasons For Choosing PostgreSQL

- Supports structured relational data
- Provides ACID properties for reliability
- Supports indexing for faster queries
- Handles large-scale concurrent operations
- Supports efficient sorting and filtering
- Good support for scalability and optimization

---

# Notifications Table Schema

| Column Name | Data Type | Description |
|---|---|---|
| id | UUID | Unique notification ID |
| student_id | INTEGER | Student identifier |
| notification_type | VARCHAR(50) | Event / Result / Placement |
| message | TEXT | Notification content |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Notification creation time |

---

# Example SQL Schema

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id INTEGER NOT NULL,
    notification_type VARCHAR(50),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Problems As Data Volume Increases

As the number of students and notifications grows, the following problems may occur:

- Slow query performance
- Increased database load
- Delayed notification retrieval
- Higher memory consumption
- Longer sorting and filtering times

---

# Solutions

## 1. Database Indexing

Indexes can be created on:

- student_id
- is_read
- created_at
- notification_type

This improves query performance.

---

## 2. Pagination

Instead of loading all notifications at once, data should be fetched page-by-page.

Example:

```http
GET /notifications?page=1&limit=20
```

---

## 3. Caching

Frequently accessed notifications can be stored temporarily using Redis cache.

---

## 4. Archiving Old Notifications

Very old notifications can be moved to archive tables to reduce active DB load.

---

# Example Queries

## Fetch Student Notifications

```sql
SELECT * FROM notifications
WHERE student_id = 1042;
```

---

## Fetch Unread Notifications

```sql
SELECT * FROM notifications
WHERE student_id = 1042
AND is_read = FALSE;
```

---

## Fetch Placement Notifications

```sql
SELECT * FROM notifications
WHERE notification_type = 'Placement';
```