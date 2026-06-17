import {getAllProperties,getSingleProperty} from "../controller/propertiesController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/properties/all',authMiddleware, getAllProperties);
router.get('/properties/:propertyId',authMiddleware, getSingleProperty);

export default router;