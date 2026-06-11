import express from 'express';
import {bookProperty,getUserBookings,changebookingStatus,cancelBooking} from '../controller/bookingController.js';
import {getOwnerBookings} from '../controller/ownerController.js';
const router= express.Router();

router.get('/owner-bookings/:ownerId',getOwnerBookings);
router.get('/user-bookings/:userId',getUserBookings);
router.put('/bookings/status/:bookingId',changebookingStatus);
router.post('/properties/book/:propertyId/:userid',bookProperty);
router.delete('/bookings/cancelbooking/:bookingId',cancelBooking);
export default router;