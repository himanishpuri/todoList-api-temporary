import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const generateAccessAndRefreshTokens = async function (id, res) {
	try {
		const user = await User.findById(id);
		if (!user) {
			return new ApiError(404, "User Not Found.").JSONError(res);
		}

		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();
		user.refreshToken = refreshToken;
		user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		return new ApiError(500, "Server Issue", err).JSONError(res);
	}
};

export const registerUser = asyncHandler(async function (req, res, next) {
	const { name, email, password } = req.body;

	try {
		const user = await User.create({
			name,
			email,
			password,
		});

		const AccessToken = user.generateAccessToken();
		const RefreshToken = user.generateRefreshToken();
		user.refreshToken = RefreshToken;
		await user.save({ validateBeforeSave: false });

		const registeredUser = {
			name: user.name,
			email: user.email,
		};

		const options = {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24, // 1 day
			sameSite: "none",
			secure: true,
		};

		return res
			.status(201)
			.cookie("accessToken", AccessToken, options)
			.cookie("refreshToken", RefreshToken, options)
			.json({
				success: true,
				message: "User Created Successfully.",
				user: registeredUser,
			});
	} catch (error) {
		return new ApiError(500, "Server Issue", error).JSONError(res);
	}
});

export const loginUser = asyncHandler(async function (req, res, next) {
	// verify email and password
	// then we will send back new refresh and access token to the front

	const { email, password } = req.body;
	if ([email, password].some((value) => !value || value.trim().length === 0)) {
		return new ApiError(404, "Email or Password not Entered.").JSONError(res);
	}

	try {
		const user = await User.findOne({ email }); // check if user exist.
		if (!user) {
			return new ApiError(401, "User Not Found.").JSONError(res);
		}

		const isRightPassword = await user.isPasswordCorrect(password); // check password
		if (!isRightPassword) {
			return new ApiError(401, "Wrong Password.").JSONError(res);
		}

		const { accessToken, refreshToken } =
			await generateAccessAndRefreshTokens(user._id, res);

		const options = {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24, // 1 day
			sameSite: "none",
			secure: true,
		};

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", refreshToken, options)
			.json({
				success: true,
				message: "User Logged In Successfully.",
				user: {
					email: user.email,
					name: user.name,
				},
			});
	} catch (error) {
		return new ApiError(500, "Server Issue", error).JSONError(res);
	}
});

export const logoutUser = asyncHandler(async function (req, res, next) {
	try {
		const user = await User.findByIdAndUpdate(req?.user?.id, {
			$set: { refreshToken: null },
		});

		if (!user) {
			return new ApiError(404, "User not found").JSONError(res);
		}
		const options = {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24, // 1 day
			sameSite: "none",
			secure: true,
		};

		return res
			.status(200)
			.clearCookie("accessToken", options)
			.clearCookie("refreshToken", options)
			.json({
				success: true,
				message: "User Logged Out Successfully!",
			});
	} catch (error) {
		return new ApiError(500, "Server Issue", error).JSONError(res);
	}
});

export const isValidUser = asyncHandler(async function (req, res, next) {
	if (req?.user?.id) {
		return res.status(200).json({
			success: true,
			message: "User is Valid.",
		});
	}

	return new ApiError(401, "User is Invalid.").JSONError(res);
});
