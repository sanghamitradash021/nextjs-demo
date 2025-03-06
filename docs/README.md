# Recipe Sharing Platform

A comprehensive recipe-sharing platform built with Next.js, TypeScript, and MySQL.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
  - [Folder Structure](#folder-structure)
- [Documentation](#documentation)
  - [API Documentation](#api-documentation)
  - [Database Schema](#database-schema)
- [Docker Deployment](#docker-deployment)
- [Testing](#testing)
  - [Unit Testing](#unit-testing)
  - [API Testing](#api-testing)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Overview

This Recipe Sharing Platform is a modern web application that allows users to share, discover, and manage recipes. Built with **Next.js** and **TypeScript** on the frontend, and **MySQL** for data storage, this platform offers user authentication, recipe creation, rating, and searching by various filters. The application provides a clean, user-friendly interface and a robust backend API.

## Features

- **User Authentication**: Secure login, signup, and profile management.
- **Recipe Management**: Users can create, update, and delete recipes.
- **Recipe Search & Filters**: Search recipes by cuisine type, meal type, and more.
- **Rating & Comments**: Rate recipes and leave comments.
- **User Dashboard**: View and manage user-specific recipes.
- **Admin Features**: Admin panel to manage recipes, users, and analytics.
- **Responsive UI**: Built with Tailwind CSS for a modern look.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn
- Docker (Optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd recipe-sharing-platform
   ```

npm install

# or

yarn install

npm run dev

# or

yarn dev

# Database Configuration

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306

# JWT Secret

JWT_SECRET=your_jwt_secret

# File Upload (Cloudinary or any service)

FILE_UPLOAD_URL=your_file_upload_url

recipe-sharing-platform/
├── app/ # Next.js App Router
│ ├── api/ # API Routes (backend API logic)
│ ├── auth/ # Authentication Pages (Login, Signup)
│ ├── my-recipes/ # User's personal recipes
│ ├── protected/ # Protected Routes (access control)
│ ├── recipe/ # Recipe Pages
│ ├── recipes/ # All Recipe Listings, Search
│ ├── global.css # Global styles
│ ├── layout.tsx # Application layout (common structure)
│ ├── page.tsx # Home Page
│ └── pagee.tsx # Another Page Example (error handling, etc.)
├── components/ # Reusable UI Components
│ ├── allrecipes.tsx # List of all recipes
│ ├── createrecipemodal.tsx # Modal for creating new recipes
│ ├── editrecipe.tsx # Edit Recipe UI
│ ├── home.tsx # Home page content
│ ├── loader.tsx # Loading indicator component
│ ├── myrecipes.tsx # Display user-created recipes
│ ├── navbar.tsx # Navbar for navigation
│ ├── protectedroutes.tsx # Protected route handling
│ ├── recipedatalist.tsx # Recipe listing display
│ ├── recipelist.tsx # Recipe list view
│ └── singlerecipe.tsx # Single Recipe display
├── config/ # Configuration files
│ └── db.ts # Database configuration and connection
├── constants/ # Constants for application logic
│ └── HomeConstant.ts # Example constants for home page
├── context/ # React Context for global state
├── db/ # Database Models, Migrations
│ ├── models/ # Sequelize ORM models
│ └── migration/ # Database migrations for schema setup
├── hooks/ # Custom React Hooks for data fetching
├── lib/ # Helper functions and utilities
├── middleware/ # Middlewares for API or request handling
├── services/ # API Service layer for interacting with backend
├── store/ # Zustand store (state management)
├── testing/ # Tests for components, API, etc.
│ ├── component/ # Component-level tests
│ ├── api/ # API tests (unit and integration)
├── types/ # TypeScript Type Definitions
├── .env # Environment Variables
├── docker-compose.yml # Docker configuration for multi-container setup
├── Dockerfile # Docker configuration for containerization
├── next.config.ts # Next.js configuration
├── package.json # Project dependencies and scripts
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json # TypeScript configuration

Folder Structure Breakdown
app/: Contains all the main application logic, including API routes, pages, and layouts.

api/: The API logic, where backend endpoints like comments, recipes, ratings, users, and interceptors reside.

auth/: Authentication-related pages like login and signup.

my-recipes/: Displays the recipes created by the currently logged-in user.

protected/: Contains routes that are protected and require authentication.

recipe/: Recipe-related pages, including single recipe display and recipe creation.

recipes/: General recipe listing, categorized by cuisine, meal type, etc.

components/: Reusable components that are used across different pages.

db/: Contains the database configuration and Sequelize models, migrations for database setup.
testing/: Unit and integration tests for the components and API routes.

store/: Zustand store for global state management.

config/: Configuration files like database connections and other service integrations.
