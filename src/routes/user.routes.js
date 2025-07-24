import { Router } from "express";
import {registeruser, loginuser, logoutuser,refreshAccesToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage} from "../controlles/user.controller.js";
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


router.route("/login").post(upload.none(),loginuser);

router.route("/logout").post(verifyJwt, logoutuser);

router.route("/refresh-token").post(refreshAccesToken);

router.route("/changepassword").post(changeCurrentPassword);

router.route("/getcurrentuser").post(getCurrentUser);


router.route("/updateaccountdetails").post(updateAccountDetails);


router.route("/updateavatar").post(updateUserAvatar);

router.route("/updatecoverimage").post(updateUserCoverImage);


export default router;

