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