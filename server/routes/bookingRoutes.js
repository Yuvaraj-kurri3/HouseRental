import express from 'express';
import {bookProperty,getUserBookings,cancelBooking} from '../controller/bookingController.js';
import {getOwnerBookings} from '../controller/ownerController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router= express.Router();

router.get('/owner-bookings/:ownerId',authMiddleware,getOwnerBookings);
router.get('/user-bookings/:userId',authMiddleware,getUserBookings);
router.post('/properties/book/:propertyId/:userid',authMiddleware,bookProperty);
router.delete('/bookings/cancelbooking/:bookingId',authMiddleware,cancelBooking);
export default router;