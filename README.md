# Store Rating Application

A full-stack web application that allows users to rate stores and enables administrators and store owners to manage and view ratings.

## Tech Stack

### Frontend

* React
* TypeScript
* Axios
* React Router

### Backend

* NestJS
* Prisma ORM
* JWT Authentication
* PostgreSQL

## Features

### System Administrator

* Login to the platform
* View dashboard statistics

  * Total Users
  * Total Stores
  * Total Ratings
* Create Normal Users
* Create Admin Users
* Create Store Owners
* View all users
* View all stores

### Normal User

* Register and Login
* Update password
* View all stores
* Search stores by name and address
* Submit ratings (1-5)
* Modify existing ratings

### Store Owner

* Login
* Update password
* View average rating of their store
* View users who rated their store

## Database Schema

### User

* id
* name
* email
* password
* address
* role

### Store

* id
* name
* email
* address
* ownerId

### Rating

* id
* rating
* userId
* storeId

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd store-rating-app
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

Run migrations and start backend:

```bash
npx prisma generate
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:3000
```

## Authentication

JWT-based authentication is implemented with role-based access control.

Roles:

* ADMIN
* USER
* STORE_OWNER

## Author

Sanket Deore
