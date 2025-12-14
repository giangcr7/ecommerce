import { Router } from "express";
import { getHomePage } from "../controllers/client/homeController";
const router = Router();
router.get('/', getHomePage);
export default router;