import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
} from "../controllers/user.controller.js";
import {
	verifyAccessToken,
	authenticateRegistrationDetails,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(authenticateRegistrationDetails, registerUser); // done
router.route("/login").post(loginUser); // done
router.route("/logout").post(verifyAccessToken, logoutUser);

export default router;
