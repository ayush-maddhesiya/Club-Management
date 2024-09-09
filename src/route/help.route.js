import { Router } from "express";
import {
  contactAdmin,
  faq,
  feedback
}  from "./../controller/help.controller.js"
const router = Router();

router.route("/contact").get(contactAdmin);
router.route("/faq").get(faq);
router.route("/feedback").post(feedback);
export default router