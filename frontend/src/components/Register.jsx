import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ErrorMsg({ msg }) {
	return (
		<p className="bg-gray-300 text-gray-600 w-full p-1 px-2 rounded-sm">
			{msg}
		</p>
	);
}

function Register() {
	const [errMsg, setErrMsg] = useState("");
	const navigate = useNavigate();
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm();

	const onSubmit = async (data) => {
		const response = await axios.post(
			"http://localhost:5000/api/user/register",
			data,
			{ withCredentials: true },
		);
		const { data: resData } = response;
		setErrMsg(resData?.message);
		setTimeout(() => {
			setErrMsg("");
		}, 5 * 1000);
		if (resData?.success) navigate("/app");
	};
	return (
		<div className="bg-gray-900 h-screen w-full grid place-items-center">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col bg-white backdrop-blur-md px-8 py-6 rounded-lg gap-y-5 min-w-[25%]"
			>
				<h1 className="self-center text-black font-semibold text-2xl select-none pb-6 text-center">
					Register your account
				</h1>
				<input
					type="text"
					placeholder="Name"
					className="rounded-lg px-3 py-2 w-full outline-none border-b-2"
					{...register("name", {
						required: "Name is required",
					})}
				/>
				<ErrorMessage
					errors={errors}
					name="name"
					render={({ message }) => <ErrorMsg msg={message} />}
				/>
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
					render={({ message }) => <ErrorMsg msg={message} />}
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
					render={({ message }) => <ErrorMsg msg={message} />}
				/>
				<button
					type="submit"
					className="bg-black text-white py-2 px-1 rounded-lg border-2 border-gray-800 hover:bg-gray-700 duration-300 w-1/2 self-center select-none"
				>
					{isSubmitting ? "Registering.." : "Register"}
				</button>
				{errMsg && <ErrorMsg msg={errMsg} />}
				<p className="text-center font-semibold">
					Have an account?{" "}
					<Link
						className="text-red-500 hover:underline"
						to={"/"}
					>
						Login In
					</Link>
				</p>
			</form>
		</div>
	);
}

ErrorMsg.propTypes = {
	msg: PropTypes.string.isRequired,
};

export default Register;
