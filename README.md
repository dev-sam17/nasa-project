# NASA Mission Control Project

A full-stack application for scheduling and tracking NASA missions to habitable exoplanets discovered by the Kepler Space Telescope.

## Project Overview

This project consists of a React-based frontend and a Node.js/Express backend that allows users to:
- Schedule missions to habitable exoplanets
- View upcoming scheduled missions
- View mission history
- Abort upcoming missions

## Tech Stack

### Frontend (Client)
- React 17
- React Router 5
- Arwes UI Framework (Sci-Fi UI)
- Built with Create React App

### Backend (Server)
- Node.js
- Express
- MongoDB (with Mongoose)
- CSV parsing for Kepler data

## Project Structure

### Client
- `/src/components` - Reusable UI components
- `/src/hooks` - Custom React hooks
- `/src/pages` - Main application pages (Launch, Upcoming, History)
- `/src/settings.js` - UI theme and configuration

### Server
- `/src/models` - Data models for planets and launches
- `/src/routes` - API endpoints for planets and launches
- `/src/services` - Database connection and other services
- `/data` - Contains Kepler exoplanet data (CSV)

## Features

- **Interactive Mission Scheduling**: Schedule new missions with custom parameters
- **Habitable Planet Selection**: Choose from exoplanets that meet habitability criteria
- **Mission History**: Track all past missions and their outcomes
- **Mission Management**: Abort upcoming missions if needed

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   This will install dependencies for both client and server

3. Start the development server:
   ```
   npm run watch
   ```
   This will start both the client and server in development mode

### Production Build

To create a production build:
```
npm run deploy
```

For cluster deployment (using PM2):
```
npm run deploy-cluster
```

## API Endpoints

- `GET /v1/planets` - Get all habitable planets
- `GET /v1/launches` - Get all scheduled launches
- `POST /v1/launches` - Schedule a new launch
- `DELETE /v1/launches/:id` - Abort a launch

## Docker Support

The project includes Docker configuration for containerized deployment.
