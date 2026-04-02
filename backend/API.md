# Financial Management & Analytics System API Documentation

## Base URL
`http://localhost:3000/api`

---

## 🔐 Authentication

### Register User
`POST /auth/register`

- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "ADMIN",
  "departmentId": "uuid-of-department"
}
```

### Login
`POST /auth/login`

- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "JWT_TOKEN"
  }
}
```

---

## 👤 User Management (Admin Only)

### Create User
`POST /users`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same as Register

### Get All Users
`GET /users?page=1&limit=10`
- **Headers:** `Authorization: Bearer <token>`

---

## 💰 Records Management

### Create Record
`POST /records`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "amount": 5000,
  "nature": "EXPENSE",
  "categoryId": "uuid",
  "departmentId": "uuid",
  "date": "2026-04-02",
  "notes": "Office supplies"
}
```

### Get Records (With Filters)
`GET /records?page=1&limit=10&nature=EXPENSE&categoryId=...&status=PENDING`
- **Headers:** `Authorization: Bearer <token>`

### Approve/Reject Record (Admin Only)
`PATCH /records/:id/approve`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "status": "APPROVED" 
}
```

---

## 📊 Dashboard & Insights

### Summary
`GET /dashboard/summary`
- Total Income, Expenses, and Net Balance.

### Category Breakdown
`GET /dashboard/categories`
- Grouped amounts by category.

### Financial Trends
`GET /dashboard/trends`
- Time-series monthly data (Income vs Expense).

### Recent Activity
`GET /dashboard/activity?limit=10`
- List of most recent transactions.
