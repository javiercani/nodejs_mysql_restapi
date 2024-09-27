import { Router } from "express";
import {
  newContact
} from "../controllers/contact.controller.js";

const router = Router();

router.post("/contact", newContact);
