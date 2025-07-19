import { Router } from "express";
import {registeruser, loginuser, logoutuser} from "../controlles/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router=Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        } 
    ]),
    registeruser);


router.route("/login").post(loginuser);

router.route("/logout").post(verifyJwt, logoutuser);
export default router;

