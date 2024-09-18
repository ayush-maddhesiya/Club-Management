import { Router } from "express";
import {
    registerCard,
    listOfAvablie,
    updateTask,
    readTask,
    deleteTask
} from "../controller/task.controller.js"

import { authenticate } from "../utils/auth.middleware.js";
const router = Router();
 router.use(authenticate)
router.route("/registerCard").post(registerCard);
router.route("/listofAvabliemember").get(listOfAvablie);
router.route("/updateTask").post(updateTask);
router.route("/readTask").get(readTask);
router.route("/deleteTask").post(deleteTask);


export default router;