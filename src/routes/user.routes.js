import { Router } from "express";
import {registeruser, loginuser, logoutuser,refreshAccesToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUseChannelProfile,getWatchHistory} from "../controlles/user.controller.js";
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

router.route("/change-password").post(verifyJwt,changeCurrentPassword);

router.route("/getcurrentuser").get(verifyJwt,getCurrentUser);


router.route("/updateaccountdetails").patch(verifyJwt,updateAccountDetails);


router.route("/updateavatar").patch(verifyJwt,upload.single(),updateUserAvatar);

router.route("/updatecoverimage").post(verifyJwt,upload.single(),updateUserCoverImage);

router.route("/channel-profile/:username").get(verifyJwt,getUseChannelProfile);

router.route("/watch-history").get(verifyJwt,getWatchHistory);
export default router;

