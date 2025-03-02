# Webz API Connector

A Node.js application built with TypeScript to fetch posts from the Webz.io `newsApiLite` endpoint, cache results in Redis, and store them in PostgreSQL.

## Features
- Fetches posts from Webz.io in batches of 200 (via 10-post API calls).
- Caches API responses in Redis for 1 hour to reduce redundant fetches.
- Stores posts in PostgreSQL with a `UNIQUE` constraint on URLs.
- Supports dynamic user queries with a default of "technology".
- Implements error resilience: continues fetching despite individual batch failures.
- Uses TypeScript with clean code principles and unit tests (Jest, no network/DB calls).
- Configurable via environment variables with Docker Compose.

## Prerequisites
- Node.js 18+
- Docker and Docker Compose
- A Webz.io API token


## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone git@github.com:ZhaAbhi/webz-query.git
   cd webz-query

2. **Install Dependencies**
npm install

3. **Configure Environment Variable**
Create a `.env` file in the root directory and copy the variables from `.env.example` file and replace with actual values


## Build the Project
npm run build

## Run with Docker Compose
docker-compose up --build
Access at http://localhost:3000.

## Usage Instructions
- Fetch Posts 
curl "http://localhost:3000/fetch-posts?query=Bitcoin"

- Default("technology")
curl "http://localhost:3000/fetch-posts"

- Check Health
curl "http://localhost:3000/health"

## Running Tests
- Unit tests mock all external dependencies
1. Run All Tests
npm run test
2. Run Specific Test
npm run test -- tests/utils/queryBuilder.test.ts

## Architecture
graph TD
    A[Client<br/>(User/Browser)] -->|HTTP GET /fetch-posts| B[Express.js Server<br/>(API Layer)]

    subgraph Application
        B -->|Routes| C[Middleware<br/>(Validation)]
        C -->|Validated Request| D[WebzService<br/>(Service Layer)]
        
        subgraph Services
            D -->|Fetch Data| E[Webz.io API<br/>(Mocked in Tests)]
            D -->|Cache Check/Update| F[Redis<br/>(Mocked in Tests)]
            D -->|Store Posts| G[PostgreSQL<br/>(Mocked in Tests)]
        end

        subgraph Utilities
            D --> H[QueryBuilder]
            B --> I[Logger<br/>(Winston)]
        end
    end

    E -->|Returns Posts| D
    F -->|Cache Hit/Miss| D
    G -->|Save Confirmation| D
    D -->|Response Callback| B
    B -->|HTTP Response| A

    classDef external fill:#f9f,stroke:#333,stroke-width:2px;
    class E,F,G external;
    classDef app fill:#bbf,stroke:#333,stroke-width:2px;
    class B,C,D,H,I app;
    classDef client fill:#dfd,stroke:#333,stroke-width:2px;
    class A client;