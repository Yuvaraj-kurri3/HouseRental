import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { newProperty ,getOwnerProperties,deleteProperty, updatePropertyDetails,changebookingStatus, getMyDetails} from "../controller/ownerController.js"
import { uploadPropertyImages } from "../controller/uploadController.js";
import upload from "../middlewares/multerMiddleware.js";

const router = express.Router()

router.post('/newProperty', authMiddleware, newProperty)
router.get('/myProperties/:ownerId', authMiddleware, getOwnerProperties)
router.delete('/deleteProperty/:propertyId', deleteProperty)
router.put('/updateProperty/:propertyId', authMiddleware, updatePropertyDetails)
router.put('/bookings/status/:bookingId',changebookingStatus);
router.get('/ownerDetails/:ownerId',getMyDetails);
router.post('/upload', upload.array('images', 1), uploadPropertyImages);

export default router;