import { Router } from "express";
import { renderDashBoard } from "../../controllers/admin/dashboard.controller";
const router = Router();
router.get("/dashboard", renderDashBoard);
export default router;