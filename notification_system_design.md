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
# Real-Time Notifications
We will use WebSockets to send notifications in real time.
## How it works
1. The client connects to the WebSocket server
2. When something happens, the server pushes the notification right away
3. The frontend shows it without needing a page refresh
4. Read and unread status also updates on its own
## Why WebSockets?
- No need to keep asking the server for updates
- Notifications show up instantly
- Better experience for the user
- Less load on the server
# Stage 2
# Database Design
## Database We Are Using
We picked PostgreSQL as the main database for this system.
## Why PostgreSQL?
- It works well with structured data
- It follows ACID rules so data stays safe
- Indexing makes queries run faster
- It can handle many users at the same time
- Sorting and filtering work well
- It can scale as the app grows
---
# Notifications Table
| Column Name | Data Type | Description |
|---|---|---|
| id | UUID | Unique ID for each notification |
| student_id | INTEGER | Which student this belongs to |
| notification_type | VARCHAR(50) | Type like Event, Result, Placement |
| message | TEXT | The actual notification text |
| is_read | BOOLEAN | Has the student read it or not |
| created_at | TIMESTAMP | When it was created |
---
# SQL to Create the Table
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
# Problems When Data Gets Too Big
As more students join and more notifications get created, we may face:
- Queries getting slow
- Database getting overloaded
- Notifications taking longer to load
- More memory being used
- Sorting and filtering taking more time
---
# How to Fix These Problems
## 1. Add Indexes
We can add indexes on columns we search often:
- student_id
- is_read
- created_at
- notification_type
This makes queries much faster.
---
## 2. Use Pagination
Instead of loading everything at once, load a few at a time.
Example:
```http
GET /notifications?page=1&limit=20
```
---
## 3. Use Caching
We can use Redis to store notifications that are accessed a lot. This way the database doesn't get hit every time.
---
## 4. Archive Old Notifications
Old notifications can be moved to a separate table so the main table stays small and fast.
---
# Some Example Queries
## Get All Notifications for a Student
```sql
SELECT * FROM notifications
WHERE student_id = 1042;
```
---

## Get Only Unread Notifications
```sql
SELECT * FROM notifications
WHERE student_id = 1042
AND is_read = FALSE;
```
---
## Get Only Placement Notifications
```sql
SELECT * FROM notifications
WHERE notification_type = 'Placement';
```
# Stage 3
# Query Optimization and Indexing
## The Query We Are Looking At
```sql
SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```
---
# Is This Query Correct?
Yes, the logic is fine. It gets all unread notifications for a student and sorts them by time.
---
# Why Does It Get Slow?
The problem is when the notifications table has millions of rows.
The database has top
- go through all the rows
- find only the unread ones
- then sort them by time
If there are no indexes, this takes a long time.
---
# What We Should Do
We should create a composite index on these three columns:
- studentID
- isRead
- createdAt
---
# The Index
```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, is_read, created_at);
```
This makes filtering and sorting a lot faster.
---
# Why Not Just Index Everything?
Indexing every column is a bad idea because:
- indexes take up extra storage space
- inserting new rows becomes slower
- updating rows also becomes slower
- too many indexes just make things worse overall
Only add indexes on columns you actually search or sort by a lot.
---
# Query for Placement Notifications in Last 7 Days
```sql
SELECT *
FROM notifications
WHERE notification_type = 'Placement'
AND created_at >= NOW() - INTERVAL '7 days';
```
---
# How Much Does Indexing Help?
Without indexes:
- The database reads every single row
- This gets very slow for large tables
With indexes:
- The database jumps straight to the right rows
- Much less disk reading
- Works well even when the table is very large
---
# Other Things We Can Do
## 1. Pagination
Load notifications a page at a time instead of all at once:
```http
GET /notifications?page=1&limit=20
```
---
## 2. Caching
Use Redis to store commonly accessed notifications so the database is not hit every time.
---
## 3. Archiving
Move old notifications to a separate table so the main table stays small.
# Stage 4
# Making the System Faster
## What is the Problem?
Every time a student opens the app, it fetches notifications from the database.
When many students use the app at the same time, the database gets too many requests.
This leads to:
- database getting slow
- API taking longer to respond
- server using more resources than needed
- bad experience for the user
---
# Ways to Fix This
## 1. Redis Caching
We can save frequently accessed notifications in Redis.
Instead of hitting the database every time:
- check cache first
- if data is there, return it from cache
- if not, fetch from database and then save to cache
### Good things about this
- faster responses
- less load on database
- app scales better
### Downside
- uses extra memory
- need to handle when cache becomes outdated
---
# 2. Pagination
Load notifications a few at a time, not all at once.
Example:
```http
GET /notifications?page=1&limit=20
```
### Good things about this
- less data sent in each response
- API responds faster
- frontend renders less at a time
### Downside
- needs extra logic to handle pages
---
# 3. Lazy Loading
Only load notifications when the user actually needs to see them.
### Good things about this
- frontend feels faster
- fewer API calls overall
### Downside
- a bit more work on the frontend side
---
# 4. Database Indexing
Add indexes on the columns we filter by most:
- student_id
- is_read
- created_at
### Good things about this
- filtering is faster
- sorting is faster
### Downside
- inserts and updates get a bit slower
---
# 5. Archiving Old Notifications
Move old notifications to a different table regularly.
### Good things about this
- main table stays small
- queries run faster
### Downside
- need a separate process to fetch old notifications
---
# 6. WebSockets Instead of Polling
Push notifications to the frontend in real time instead of the frontend asking again and again.
### Good things about this
- updates show up instantly
- no repeated API calls
### Downside
- need to manage persistent connections
---
# What We Recommend
1. PostgreSQL as the main database
2. Redis for caching
3. WebSockets for real-time delivery
4. Pagination to load data in parts
5. Indexes on important columns
6. Archive strategy for old notifications


# Stage 5
# Making the System Reliable
## What is the Problem?
Many systems in the university send notifications at the same time.
For example:
- placement portal
- exam portal
- fee management system
- academic system
During busy times, thousands of notifications can arrive at once.
The system must make sure:
- no notification gets lost
- it keeps working even if something fails
- it can handle a lot of load
- it is reliable
---
# How We Plan to Build It
The system will use:
- Message Queue
- Notification Processing Service
- Retry Mechanism
- Dead Letter Queue
- WebSocket for real-time delivery
---
# How Data Flows

```text
University Systems
        ↓
 Message Queue (Kafka / RabbitMQ)
        ↓
 Notification Processing Service
        ↓
 PostgreSQL Database
        ↓
 WebSocket Server
        ↓
 Student Frontend
```
---
# Why Use a Message Queue?
A message queue helps handle a lot of traffic without crashing.
Instead of writing everything to the database at once:
- notifications go into the queue first
- they get processed one by one
- the server does not get overloaded
---
# Benefits of Message Queue
## 1. Reliability
Even if the server goes down, the notifications stay safe inside the queue.
---
## 2. Scalability
Multiple workers can process notifications at the same time.
--
## 3. Fault Tolerance
If one part fails, messages are not lost. They wait in the queue.
---
## 4. Handles Traffic Spikes
The queue absorbs sudden bursts of notifications and processes them at a steady pace.
---
# Retry Mechanism
If processing a notification fails:
1. try again automatically
2. wait a bit before retrying
3. stop after a set number of retries
This way a temporary failure does not cause a notification to disappear.
---
# Dead Letter Queue
If a notification keeps failing even after retries, it goes to a Dead Letter Queue.
This lets us:
- check what went wrong
- look at failed messages
- fix and reprocess them later
---
# Real-Time Delivery
After a notification is processed:
- it gets saved in PostgreSQL
- it gets pushed to the student's frontend using WebSockets
So the student sees it right away without refreshing the page.
---
# Technologies We Will Use
| Component | Technology |
|---|---|
| Database | PostgreSQL |
| Cache | Redis |
| Queue | RabbitMQ / Kafka |
| Backend | Node.js + Express |
| Real-Time | WebSockets |
| Frontend | React |
---
# Why This Architecture Works
- handles a lot of users without breaking
- notifications are never lost
- system keeps working even if one part fails
- updates reach students instantly
- database does not get overloaded
- traffic spikes are handled smoothly
