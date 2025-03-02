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

## Prerequisites
- Node.js 18+
- Docker and Docker Compose
- A Webz.io API token

## Setup
1. **Clone the Repository**:
   ```bash
   git clone git@github.com:ZhaAbhi/webz-query.git
   cd webz-query

2. **Install Dependencies**:
   ```npm install```

3. **Configure Environment Variables**:
   - Copy .env.example to .env and update with your values