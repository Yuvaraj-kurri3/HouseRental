import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/connect.js';
import userRoutes from './routes/userRoutes.js';
import authRoute from './routes/authRoute.js';
import ownerRoutes from './routes/ownerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import propertiesRoute from './routes/propertiesRoute.js';

dotenv.config();
const app = express();
const PORT = 3000;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
];
app.set("trust proxy", 1);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
  })
);

connectDb(process.env.MONGO_URI);



app.use('/api/users', userRoutes);
app.use('/api/auth', authRoute);
app.use('/api/owner', ownerRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/properties', propertiesRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});