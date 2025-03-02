# Webz Query

A Node.js application built with TypeScript to fetch posts from the Webz.io `newsApiLite` endpoint, cache results in Redis, and store them in PostgreSQL.

## Features
- Fetches posts from Webz.io in batches of 200 (via 10-post API calls).
- Caches API responses in Redis for 1 hour to reduce redundant fetches.
- Stores posts in PostgreSQL with a `UNIQUE` constraint on URLs.
- Supports dynamic user queries with a default of "technology".
- Implements error resilience: continues fetching despite individual batch failures.
- Uses TypeScript with clean code principles and unit tests (Jest, no network/DB calls).
- Configurable via environment variables with Docker Compose.

## High level Architecture
![webz-query-architecture](https://github.com/user-attachments/assets/48ff75dc-9e39-4181-820e-3e6bc78b3a41)


## Prerequisites
- Node.js 18+
- Docker and Docker Compose
- A Webz.io API token

## Setup Instructions

### 1. Clone the Repository
```bash
git clone git@github.com:ZhaAbhi/webz-query.git
cd webz-query
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and copy the variables from `.env.example`, then replace them with actual values.

## Build the Project
```bash
npm run build
```

## Run with Docker Compose
```bash
docker-compose up --build
```
Access the application at [http://localhost:3000](http://localhost:3000).

## Usage Instructions

### Fetch Posts
```bash
curl "http://localhost:3000/fetch-posts?query=Bitcoin"
```

### Default Query ("technology")
```bash
curl "http://localhost:3000/fetch-posts"
```

### Check Health
```bash
curl "http://localhost:3000/health"
```

## Running Tests
- Unit tests mock all external dependencies.

### Run All Tests
```bash
npm run test
```

### Run Specific Test
```bash
npm run test -- tests/utils/queryBuilder.test.ts
```

