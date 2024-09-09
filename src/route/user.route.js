import { Router } from "express";
import {
    registerUser,
    login
} from "../controller/user.controller.js"

import {logOut} from '../controller/setting.controller.js'
import { authenticate } from "../utils/auth.middleware.js";
const router = Router()

router.route("/registerUser").post(registerUser)
router.route("/login").post(login)
router.route(authenticate,"/logout").post(logOut)

export default router;
