import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

function Error({ msg }) {
	return (
		<p className="bg-gray-300 text-gray-600 w-full p-1 px-2 rounded-sm">
			{msg}
		</p>
	);
}

function Login() {
	const [errMsg, setErrMsg] = useState("");
	const navigate = useNavigate();
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm();

	const onSubmit = async (data) => {
		const response = await fetch("http://localhost:5000/api/user/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const resData = await response.json();
		localStorage.setItem("accessToken", JSON.stringify(resData?.accessToken));
		localStorage.setItem(
			"refreshToken",
			JSON.stringify(resData?.refreshToken),
		);
		setErrMsg(resData?.message);
		setTimeout(() => {
			setErrMsg("");
		}, 5 * 1000);
		if (resData?.success) {
			navigate("/app");
		}
		// console.log(resData);
	};
	return (
		<div className="bg-gray-900 h-screen w-full grid place-items-center">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col bg-white backdrop-blur-md px-8 py-6 rounded-lg gap-y-5 min-w-[25%]"
			>
				<h1 className="self-center text-black font-semibold text-2xl select-none pb-6 text-center">
					Sign in to your account
				</h1>
				<input
					type="text"
					placeholder="Email"
					className="rounded-lg px-3 py-2 w-full outline-none border-b-2"
					{...register("email", {
						required: "Email is required",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i,
							message: "Invalid email address",
						},
					})}
				/>
				<ErrorMessage
					errors={errors}
					name="email"
					render={({ message }) => <Error msg={message} />}
				/>
				<input
					type="password"
					placeholder="Password"
					className="rounded-lg px-3 py-2 w-full outline-none border-b-2"
					{...register("password", {
						required: "Password is required",
						minLength: {
							value: 1,
							message: "Password is must be at least 1 character",
						},
					})}
				/>
				<ErrorMessage
					errors={errors}
					name="password"
					render={({ message }) => <Error msg={message} />}
				/>
				<button
					type="submit"
					className="bg-black text-white py-2 px-1 rounded-lg border-2 border-gray-800 hover:bg-gray-700 duration-300 w-1/2 self-center select-none"
				>
					{isSubmitting ? "Submiting.." : "Submit"}
				</button>
				{errMsg && <Error msg={errMsg} />}
				<p className="text-center font-semibold">
					Don&rsquo;t have an account?{" "}
					<Link
						className="text-red-500 hover:underline"
						to={"/register"}
					>
						Sign up
					</Link>
				</p>
			</form>
		</div>
	);
}

Error.propTypes = {
	msg: PropTypes.string.isRequired,
};

export default Login;
