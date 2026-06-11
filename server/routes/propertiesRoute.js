import {getAllProperties,getSingleProperty} from "../controller/propertiesController.js";
import express from 'express';
const router = express.Router();

router.get('/properties/all', getAllProperties);
router.get('/properties/:propertyId', getSingleProperty);

export default router;