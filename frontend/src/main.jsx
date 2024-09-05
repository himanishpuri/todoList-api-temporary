import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
	},
	{
		path: "/register",
		element: (
			<ProtectedRoute>
				<Register />
			</ProtectedRoute>
		),
	},
	{
		path: "/app",
		element: (
			<ProtectedRoute>
				<App />
			</ProtectedRoute>
		),
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	// <React.StrictMode>
	<RouterProvider router={router}></RouterProvider>,
	// </React.StrictMode>,
);
