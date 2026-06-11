import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { newProperty ,getOwnerProperties,deleteProperty, updatePropertyDetails} from "../controller/ownerController.js"
const router = express.Router()

router.post('/newProperty', authMiddleware, newProperty)
router.get('/myProperties/:ownerId', authMiddleware, getOwnerProperties)
router.delete('/deleteProperty/:propertyId', deleteProperty)
router.put('/updateProperty/:propertyId', authMiddleware, updatePropertyDetails)
export default router;