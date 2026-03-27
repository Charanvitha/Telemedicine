# Telemedicine Platform
http://localhost:5173/
Full-stack telemedicine platform with React, Tailwind CSS, Express, MongoDB, Socket.IO, Multer, and PDFKit.

## Folder Structure

```text
Telemedicine/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      scripts/
      utils/
    .env.example
    package.json
  frontend/
    src/
      components/
      context/
      layouts/
      pages/
      services/
    .env.example
    package.json
```

## Backend Features

- JWT authentication with patient, doctor, and admin roles
- Doctor availability management
- Appointment creation and status updates
- Room-based WebRTC signaling over Socket.IO
- Prescription creation with downloadable PDF output
- Medical records with file upload support
- Admin analytics and user management

## Frontend Features

- Login and registration flows
- Role-based dashboards
- Doctor directory and booking workflow
- Appointment management and consultation room entry
- Medical records and prescriptions pages
- Admin dashboard for analytics and user deletion

## Database Design

- `User`: patients, doctors, admins, profile metadata, hashed password
- `Availability`: doctor weekly slot definitions
- `Appointment`: patient-doctor booking, room ID, status, notes
- `Prescription`: one prescription per appointment, medicines, PDF URL
- `MedicalRecord`: patient files and history linked to appointments

## Run Locally

### 1. Configure MongoDB

Set `MONGO_URI` in `backend/.env` to your local MongoDB instance or MongoDB Atlas connection string.

### 2. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run seed:admin
npm run dev
```

### 3. Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`  
Backend default URL: `http://localhost:5001`

## Environment Variables

Backend env example: [backend/.env.example](/C:/Users/HP/OneDrive/Pictures/Attachments/Desktop/projects/Telemedicine/backend/.env.example)

Frontend env example: [frontend/.env.example](/C:/Users/HP/OneDrive/Pictures/Attachments/Desktop/projects/Telemedicine/frontend/.env.example)

## Main API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users/doctors`
- `PUT /api/users/profile`
- `GET /api/availability/:doctorId`
- `POST /api/availability`
- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/:id/status`
- `GET /api/prescriptions`
- `POST /api/prescriptions`
- `GET /api/records`
- `GET /api/records/me`
- `POST /api/records`
- `GET /api/admin/analytics`
- `GET /api/admin/users`

## Demo Admin Credentials

After running `npm run seed:admin`, use the values from backend `.env`:

- Email: `admin@telemed.local`
- Password: `Admin@123`

## Notes

- Video consultation uses WebRTC peer connections and Socket.IO for signaling.
- File uploads and generated PDFs are stored locally under `backend/uploads` and `backend/prescriptions`.
- I did not install dependencies or run the app in this environment, so local verification is still needed after `npm install`.
