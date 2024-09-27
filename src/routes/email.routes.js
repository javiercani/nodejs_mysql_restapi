import { Router } from "express";
import { newEmail, sendEmail } from "../controllers/email.controller.js";

const router = Router();

router.post("/email", newEmail);
router.post("/email/:id", sendEmail);

export default router;