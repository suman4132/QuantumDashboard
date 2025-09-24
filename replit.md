# Overview

This is a quantum computing job management dashboard application built with React, Express.js, and TypeScript. The system provides a comprehensive interface for managing quantum computing jobs, monitoring backend systems, and tracking execution analytics. The application simulates IBM Quantum services and provides real-time job tracking, status monitoring, and data visualization capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite**: Build tool and development server for fast development experience
- **Tailwind CSS + shadcn/ui**: Utility-first CSS framework with pre-built component library
- **Framer Motion**: Animation library for smooth UI transitions and interactions
- **React Query**: Server state management and data fetching with automatic caching
- **React Router**: Client-side routing for navigation between pages

## Backend Architecture
- **Express.js**: RESTful API server handling quantum job operations
- **TypeScript**: Full type safety across the entire application stack
- **Memory Storage**: In-memory data storage with interfaces for future database integration
- **Simulated IBM Quantum Integration**: Mock service simulating real IBM Quantum API behavior
- **Real-time Updates**: Automatic job status transitions and live dashboard updates

## Data Storage Solutions
- **Drizzle ORM**: Database toolkit configured for PostgreSQL with schema definitions
- **PostgreSQL**: Production database setup (currently using Neon serverless)
- **In-memory Storage**: Development and demo mode using Map-based storage
- **Schema Management**: Shared schema definitions between frontend and backend

## Authentication and Authorization
- **Client-side Authentication**: Simple token-based auth stored in localStorage
- **Protected Routes**: Route guards preventing unauthorized access to dashboard
- **Demo Mode**: Accepts any credentials for demonstration purposes
- **Session Management**: User data persistence across browser sessions

## External Dependencies
- **IBM Quantum API Integration**: Service layer for connecting to IBM Quantum backends
- **Neon Database**: Serverless PostgreSQL hosting for production deployments
- **Recharts**: Data visualization library for analytics charts and graphs
- **Date-fns**: Date manipulation and formatting utilities
- **Axios**: HTTP client for external API communications

The application follows a monorepo structure with shared types and schemas, enabling type-safe communication between frontend and backend. The architecture supports both development simulation and production quantum computing integration.