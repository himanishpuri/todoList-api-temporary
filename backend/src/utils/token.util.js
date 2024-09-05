import ApiError from "./ApiError.js";
import User from "../models/user.model.js";

export async function generateToken(req, res, next) {
	if (!req?.user) {
		return new ApiError(401, "Unauthorized, Log In again.").JSONError(res);
	}

	try {
		const user = await User.findById(req.user?.id);
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();
		user.refreshToken = refreshToken;
		await user.save();

		const options = {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24, // 1 day
			sameSite: "none",
			secure: true,
			domain: "localhost",
			path: "/",
		};

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", refreshToken, options)
			.json({
				message: "New Token Generated.",
				success: true,
			});
	} catch (error) {
		return new ApiError(500, "Could Not Generate Cookie.").JSONError(res);
	}
}
