# Restaurant API

A simple Express.js API for managing restaurants.

## Features

- Display all restaurants
- Get restaurant by ID
- Create new restaurants
- Update existing restaurants

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   PORT=3000
   ```
4. Generate Prisma client:
   ```
   npx prisma generate
   ```
5. Run database migrations:
   ```
   npx prisma migrate dev
   ```

### Running the Application

Development mode:

```
npm run dev
```

Production mode:

```
npm run build
npm start
```

## API Endpoints

### Get all restaurants

```
GET /api/restaurants
```

### Get restaurant by ID

```
GET /api/restaurants/:id
```

### Create a new restaurant

```
POST /api/restaurants
```

Request body:

```json
{
  "name": "Restaurant Name",
  "address": "Restaurant Address"
}
```

### Update a restaurant

```
PUT /api/restaurants/:id
```

Request body:

```json
{
  "name": "Updated Restaurant Name",
  "address": "Updated Restaurant Address"
}
```

## Best Practices Implemented

- Structured project organization (MVC pattern)
- Input validation using express-validator
- Error handling middleware
- Security headers with helmet
- CORS configuration
- Environment variable management
- Type safety with TypeScript
- Database access via Prisma ORM
- RESTful API design
