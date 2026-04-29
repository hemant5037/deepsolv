# Pokedex Lite (MERN + JWT)

A responsive full-stack Pokedex application built with MongoDB, Express, React, and Node.js.  
It uses [PokéAPI](https://pokeapi.co/) for Pokémon data and JWT authentication for secure user sessions.

## Features

- JWT-based authentication (register/login/logout)
- Pokémon listing with image, name, and type
- Search by name
- Filter by type
- Pagination (server-driven)
- Favorite/unfavorite Pokémon
- Favorites persisted in MongoDB and linked to logged-in user
- Pokémon detail modal (stats, abilities, weight, height, base experience)
- Fully responsive UI (mobile/tablet/desktop)

## Tech Stack

- **Frontend:** React + Vite + Axios
- **Backend:** Node.js + Express + Axios
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs

## APIs Used

- [PokéAPI Home](https://pokeapi.co/)
- [PokéAPI v2 Docs](https://pokeapi.co/docs/v2)

## Project Structure

```
deepsolv/
  client/   # React frontend
  server/   # Express backend
```

## Setup Instructions

### 1) Install dependencies

From project root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 2) Configure environment variables

Create environment files from examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update `server/.env` values:

- `MONGO_URI`: your MongoDB connection string
- `JWT_SECRET`: a secure random secret

### 3) Run in development

From project root:

```bash
npm run dev
```

This starts:

- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`

## Build

Build frontend for production:

```bash
npm run build
```

## Important API Endpoints (Backend)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/pokemon`
- `GET /api/pokemon/types`
- `GET /api/pokemon/:identifier`
- `GET /api/favorites` (auth required)
- `POST /api/favorites` (auth required)
- `DELETE /api/favorites/:pokemonId` (auth required)

## Challenges & Notes

- Type filtering with pagination is handled on the backend by using PokéAPI type endpoints and slicing results for page windows.
- Favorites are persisted in MongoDB per-user and restored on refresh after login.
- The UI is optimized with responsive grid layouts and compact controls for smaller screens.

## Optional Deployment

You can deploy:

- frontend to Vercel/Netlify
- backend to Render/Railway
- database on MongoDB Atlas
