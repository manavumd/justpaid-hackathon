# JustPaid Hackathon Project

Welcome to the JustPaid Hackathon Project! This repository contains both the backend and frontend components of our application, designed to provide a seamless experience for users seeking financial experts.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Backend Setup](#backend-setup)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables-1)
  - [Running the Application](#running-the-application)

## Project Overview

The JustPaid Hackathon Project is an application that connects users with financial experts. It leverages a React-based frontend and a Django backend to provide a robust and user-friendly platform.

## Features

- **User Authentication**: Secure login and registration system.
- **Expert Search**: Find financial experts based on location and expertise.
- **Chatbot Integration**: Interactive chatbot to assist users in navigating the platform.
- **Responsive Design**: Accessible on various devices and screen sizes.

## Tech Stack

- **Frontend**: React, JavaScript, HTML, CSS
- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL
- **APIs**: Google Maps API, Dialogflow API

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Python 3.8 or higher
- Node.js 14.x or higher
- npm 6.x or higher
- PostgreSQL 12.x or higher

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/manavumd/justpaid-hackathon.git
   cd justpaid-hackathon
   ```

2. **Set up the backend**:

   Navigate to the backend directory:

   ```bash
   cd backend
   ```

   Create a virtual environment and activate it:

   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

   Install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the frontend**:

   Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

   Install the required packages:

   ```bash
   npm install
   ```

## Backend Setup

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
GEMINI_API_KEY=
GOOGLE_MAPS_API_KEY=
POSTGRES_PASSWORD=
```

Replace `your_secret_key`, `user`, `password`, `your_db_name`, `your_dialogflow_project_id`, and `your_google_maps_api_key` with your actual credentials.

### Running the Server

Apply migrations and start the development server:

```bash
python manage.py migrate
python manage.py runserver
```

## Frontend Setup

### Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_DIALOGFLOW_AGENT_ID=your_dialogflow_agent_id
```

Replace `your_google_maps_api_key` and `your_dialogflow_agent_id` with your actual credentials.

### Running the Application

Start the React development server:

```bash
npm start
```

The application should now be running at `http://localhost:3000`.