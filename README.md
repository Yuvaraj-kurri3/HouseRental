# House Rental Application
A comprehensive full-stack house rental platform built using the MERN stack (MongoDB, Express.js, React, Node.js). This application provides a seamless experience for users to browse, search, and book rental properties, while offering dedicated interfaces for property owners to list and manage their properties, and for administrators to oversee the entire platform.
## Features
- **Multi-role System:** Dedicated roles for Users, Owners, and Administrators.
- **User Features:** Browse properties, make bookings, and manage user profiles.
- **Owner Features:** List new properties, manage existing listings, and handle booking requests.
- **Admin Features:** Oversee all users, owners, properties, and bookings across the platform.
- **Secure Authentication:** User authentication and authorization using JSON Web Tokens (JWT) and bcrypt.
- **Image Management:** Seamless property image uploads using Multer and Cloudinary.
- **Responsive UI:** Modern and responsive user interface built with React and Tailwind CSS.
## Technology Stack
### Frontend (Client)
- **Framework:** React (built with Vite for fast compilation)
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** JWT, bcrypt
- **File Uploads:** Multer, Cloudinary
## Getting Started
### Prerequisites
- Node.js installed on your machine.
- MongoDB instance (local or Atlas).
- Cloudinary account for image storage.
### Installation
1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url main ❌, Main✅ (from main branch but , M should capital)>
   cd HouseRental
   ```
2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```
3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```
### Configuration
Create a `.env` file in the `server` directory and add your environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
### Running the Application
**Run Backend Server:**
```bash
cd server
npm run dev
```
**Run Frontend Client:**
```bash
cd client
npm run dev
```
The application will typically be available at `http://localhost:5173` (for Vite frontend) and the server at `http://localhost:5000`.