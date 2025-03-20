# ttp_client
# Logistics Information Portal

## Overview

This project is a website designed to showcase logistics information and allow the company's customers to check the status of their documents. The platform provides real-time updates and detailed insights into shipment tracking, document verification, and overall logistics management.

## Features

- **Real-Time Logistics Data:** Access live updates on shipments and tracking details.
- **Document Status Tracking:** Easily check the current status of various logistics documents.
- **Customer Access Portal:** User-friendly interface designed for customers to quickly find the information they need.
- **Secure Access:** Role-based permissions ensure that sensitive data is protected.

## Technology Stack

- **Backend:** Django REST API  
  Django is used to build a secure and scalable backend that handles data management, business logic, and API endpoints.

- **Frontend:** ReactJS  
  The ReactJS frontend creates a dynamic and responsive user interface that communicates seamlessly with the Django backend.

## Installation and Setup

### Prerequisites

- Python 3.10 or higher
- Node.js and npm (or yarn)

### Backend Setup (Django)
**Create and Activate a Virtual Environment:** 
``` bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

***Install Dependencies:**
``` bash
pip install -r requirements.txt
```
**Apply Migrations:**
``` bash
python manage.py makemigrations
python manage.py migrate
```

**Create a Superuser:**
``` bash
python manage.py createsuperuser
```

**Run the Development Server:**
```bash
python manage.py runserver
```

**Frontend Setup (ReactJS):**
Navigate to 'front-client'
```bash
cd frontend-client
```
And install dependencies:
```bash
npm install
```
**Run the React developement Server:**
```bash
npm run dev
```
