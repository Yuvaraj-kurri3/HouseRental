import {AllUsers,getAllProperties,getAllBookings,updatePermissionStatus,deleteUser} from '../controller/adminController.js'

import express from 'express'

const router= express.Router();

router.get('/getallusers',AllUsers);
router.get('/properties/getAllProperties',getAllProperties);
router.get('/bookings', getAllBookings);
router.put('/user/updatePermissionStatus',updatePermissionStatus);
router.delete('/user/deleteUser/:userId',deleteUser);

export default router;