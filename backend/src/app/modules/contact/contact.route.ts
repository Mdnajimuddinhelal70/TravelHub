import { Router } from "express";
import { createContactMessage } from "./contact.controller";
import { validateContactForm } from "./contact.validation";

const router = Router();

router.post("/send-message", validateContactForm, createContactMessage);

export const ContactRoute = router;
