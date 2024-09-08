import { Router } from "express";

import { authenticate } from "../utils/auth.middleware.js";
import { logOut, passwordChange, profileView } from "../controller/setting.controller.js";
const router = Router();

//this is are secure routes
router.use(authenticate)
router.route("/password").post(passwordChange);
router.route("/profile").post(profileView);
router.route("/logout").post(logOut);

export default router;