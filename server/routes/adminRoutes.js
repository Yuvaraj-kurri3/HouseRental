import {AllUsers,getAllProperties,getAllBookings,updatePermissionStatus,deleteUser} from '../controller/adminController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

import express from 'express'

const router= express.Router();

router.get('/getallusers',authMiddleware,AllUsers);
router.get('/properties/getAllProperties',authMiddleware,getAllProperties);
router.get('/bookings', authMiddleware,getAllBookings);
router.put('/user/updatePermissionStatus',authMiddleware,updatePermissionStatus);
router.delete('/user/deleteUser/:userId',authMiddleware,deleteUser);

export default router;