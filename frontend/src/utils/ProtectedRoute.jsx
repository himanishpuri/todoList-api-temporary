import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
	const [authenticated, setAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	const isValidUser = async function () {
		try {
			// const ans = await new Promise((req, res) => {
			// 	setTimeout(() => {
			// 		res("500");
			// 	}, 1000);
			// });
			// console.log(ans);
			await axios.post(
				"https://todo-list-app-h9cb.vercel.app/api/user/isValidUser",
				{},
				{ withCredentials: true },
			);
			setAuthenticated(true);
		} catch (error) {
			setAuthenticated(false);
			console.log(error);

			// navigate("/");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const hello = async () => {
			await isValidUser();
		};
		hello();
	}, []);

	if (loading)
		return (
			<h1 className="flex text-5xl items-center justify-center bg-black text-white min-h-screen min-w-full">
				Loading...
			</h1>
		);

	return authenticated ? children : <Navigate to="/" />;
}

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
