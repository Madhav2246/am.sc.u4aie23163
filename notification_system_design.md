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



# Stage 3

# Query Optimization And Indexing

## Existing Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

---

# Is The Query Accurate?

Yes, the query is logically correct because it retrieves unread notifications of a student sorted by creation time.

---

# Why Is The Query Slow?

The query becomes slow because the notifications table contains millions of records.

The database must:

- scan many rows
- filter unread notifications
- sort results by createdAt

Without proper indexing, this causes high query execution time.

---

# Recommended Optimization

A composite index should be created on:

- studentID
- isRead
- createdAt

---

# Optimized Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, is_read, created_at);
```

This significantly improves filtering and sorting performance.

---

# Why Not Add Indexes On Every Column?

Adding indexes on every column is not recommended because:

- indexes consume extra storage
- inserts become slower
- updates become slower
- unnecessary indexes reduce overall DB performance

Indexes should only be created for frequently searched or sorted columns.

---

# Query To Fetch Placement Notifications In Last 7 Days

```sql
SELECT *
FROM notifications
WHERE notification_type = 'Placement'
AND created_at >= NOW() - INTERVAL '7 days';
```

---

# Computational Cost

Without indexing:
- Full table scan occurs
- Time complexity becomes very high

With proper indexing:
- Query execution becomes significantly faster
- Reduced disk access
- Better scalability for large datasets

---

# Additional Improvements

## 1. Pagination

Instead of loading all notifications:

```http
GET /notifications?page=1&limit=20
```

---

## 2. Caching

Frequently accessed notifications can be cached using Redis.

---

## 3. Archiving

Old notifications can be archived periodically to reduce active table size.



# Stage 4

# Performance Improvement Strategies

## Problem Statement

Notifications are fetched every time a student opens the application.

As the number of students increases, the database receives a very large number of repeated requests.

This causes:

- high database load
- slower API response
- increased server resource usage
- poor user experience

---

# Proposed Solutions

## 1. Redis Caching

Frequently accessed notifications can be stored in Redis cache.

Instead of querying the database repeatedly:

- first check cache
- if data exists, return cached data
- otherwise fetch from DB and store in cache

### Benefits

- faster response time
- reduced DB load
- improved scalability

### Tradeoff

- additional memory usage
- cache invalidation complexity

---

# 2. Pagination

Notifications should be fetched page-by-page.

Example:

```http
GET /notifications?page=1&limit=20
```

### Benefits

- reduced payload size
- faster API response
- reduced frontend rendering load

### Tradeoff

- requires additional pagination logic

---

# 3. Lazy Loading

Load notifications only when required instead of loading everything initially.

### Benefits

- improved frontend performance
- reduced API calls

### Tradeoff

- slightly more frontend complexity

---

# 4. Database Indexing

Indexes should be created on:

- student_id
- is_read
- created_at

### Benefits

- faster filtering
- faster sorting

### Tradeoff

- slower insert/update operations

---

# 5. Archiving Old Notifications

Old notifications can be moved to archive tables periodically.

### Benefits

- smaller active database size
- faster query execution

### Tradeoff

- archive retrieval becomes separate process

---

# 6. Real-Time Push Notifications

Use WebSockets instead of repeated polling.

### Benefits

- instant updates
- reduced repeated API calls

### Tradeoff

- persistent socket connection management required

---

# Recommended Final Architecture

1. PostgreSQL for persistent storage
2. Redis for caching
3. WebSockets for real-time updates
4. Pagination for scalable fetching
5. Indexed database queries
6. Archive strategy for old data