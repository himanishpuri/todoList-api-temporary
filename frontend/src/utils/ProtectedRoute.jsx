import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
	const [authenticated, setAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	const isValidUser = async function () {
		try {
			await axios.post(
				"https://todo-list-app-xxh1.vercel.app/api/user/isValidUser",
				{},
				{
					withCredentials: true,
				},
			);
			setAuthenticated(true);
		} catch (error) {
			setAuthenticated(false);
			// navigate("/");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		isValidUser();
	}, []);

	if (loading) return <h1>Loading...</h1>;

	return authenticated ? children : <Navigate to="/" />;
}

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
