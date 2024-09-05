import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	isValidUser,
} from "../controllers/user.controller.js";
import {
	verifyAccessToken,
	authenticateRegistrationDetails,
	verifyRefreshToken,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(authenticateRegistrationDetails, registerUser); // done
router.route("/login").post(loginUser); // done
router.route("/logout").post(verifyAccessToken, logoutUser);
router
	.route("/isValidUser")
	.post(verifyAccessToken, verifyRefreshToken, isValidUser);

export default router;
