# Sightspectrum Sales CRM

A complete, production-ready Sales CRM application built with FastAPI, React, and MongoDB.

## Features

### Core Modules
- **Dashboard** - Analytics and KPI tracking with charts
- **Clients** - Client account management with contacts
- **Vendors** - Vendor relationship management
- **Employees** - User management with role-based access (Admin, Manager, SalesRep)
- **Leads** - Lead tracking with auto-conversion to opportunities
- **Opportunities** - Sales opportunity pipeline management with auto-conversion to SOW
- **SOW** - Statement of Work tracking with milestone management
- **Activities** - Task and activity logging (calls, meetings, emails)
- **Settings** - System configuration management

### Key Capabilities
- **JWT Authentication** - Secure login with role-based authorization
- **Workflow Automation**:
  - Lead → Opportunity (when stage = Won)
  - Opportunity → SOW (when stage = Closed Won)
  - SOW → Activity (when status = Completed)
- **Advanced Data Tables** - Search, sort, filter, pagination, CSV export
- **Dashboard Analytics** - Real-time metrics and charts
- **Professional UI** - Sightspectrum branded design with responsive layout

## Tech Stack

- **Backend**: FastAPI (Python) + MongoDB
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Charts**: Recharts
- **Authentication**: JWT with role-based access

## Default Credentials

- **Admin**: admin@sightspectrum.com / admin123
- **Sales Rep**: john.doe@sightspectrum.com / password123
- **Manager**: jane.smith@sightspectrum.com / password123

## Workflow Automation

### Lead → Opportunity
When a Lead stage = "Won", automatically creates an Opportunity and marks Lead as Completed.

### Opportunity → SOW
When an Opportunity stage = "Closed Won", automatically creates a SOW and marks Opportunity as Completed.

### SOW → Activity
When a SOW status = "Completed", automatically creates a Kickoff Meeting activity.

## Demo Data Included

The application comes pre-seeded with sample data:
- 3 users (Admin, SalesRep, Manager)
- 2 clients
- 1 vendor
- 2 leads
- 1 opportunity
- 1 SOW
- 2 activities

Access the live demo at: https://sightsales.preview.emergentagent.com
# Sales
