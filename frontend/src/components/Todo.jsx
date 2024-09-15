import { useState } from "react";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Todo({ id, title, completed, getTodosFromServer }) {
	const navigate = useNavigate();
	const [edit, setEdit] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [msg, setMsg] = useState(title);
	const [isComplete, setIsComplete] = useState(completed);

	const updateServer = async function (msg, completed) {
		try {
			await axios.put(
				`https://todo-list-app-backend-sandy.vercel.app/api/todos/${id}`,
				{
					title: msg,
					completed,
				},
				{ withCredentials: true },
			);
		} catch (error) {
			try {
				await axios.get(
					"https://todo-list-app-backend-sandy.vercel.app/api/newToken",
					{
						withCredentials: true,
					},
				);
				await updateServer();
			} catch (error) {
				navigate("/");
			}
		}
	};

	const handleEdit = () => {
		if (edit) {
			updateServer(msg, isComplete);
		}
		setEdit((prev) => !prev);
	};

	const handleToggleComplete = () => {
		updateServer(msg, !isComplete);
		setIsComplete((prev) => !prev);
	};

	const handleDelete = async () => {
		setDeleting(true);
		try {
			await axios.delete(
				`https://todo-list-app-backend-sandy.vercel.app/api/todos/${id}`,
				{
					withCredentials: true,
				},
			);
			await getTodosFromServer();
		} catch (error) {
			try {
				await axios.get(
					"https://todo-list-app-backend-sandy.vercel.app/api/newToken",
					{
						withCredentials: true,
					},
				);
				await handleDelete();
			} catch (error) {
				navigate("/");
			}
		} finally {
			setDeleting(false);
		}
	};

	const text_toDo_Done = "line-through text-gray-400";

	return (
		<div className="bg-gray-600/40 p-4 py-5 w-screen max-w-1.5xl text-xl text-white rounded-lg border-gray-400 border-1 my-2 flex justify-around gap-x-2.5 items-center flex-1">
			<input
				className="accent-red-500 scale-125 align-baseline cursor-pointer"
				type="checkbox"
				defaultChecked={isComplete}
				onChange={handleToggleComplete}
			></input>
			<input
				className={`w-full  rounded-lg ${
					!edit
						? "bg-transparent cursor-default"
						: "bg-gray-400/20 cursor-text"
				} px-3 py-2 text-white outline-none ${
					isComplete ? text_toDo_Done : ""
				}`}
				type="text"
				value={msg}
				readOnly={!edit}
				onChange={(e) => setMsg(e.currentTarget.value)}
			></input>
			<Button
				variant="contained"
				size="large"
				sx={{
					color: "black",
					borderRadius: "0.5rem",
					boxShadow: 3,
					fontSize: "1rem",
					padding: "0.25rem 1rem",
					textTransform: "capitalize",
					fontWeight: "bold",
					backgroundColor: completed ? "gray" : "#D1D5DB",
					transition: "background-color 200ms", // Equivalent to duration-200
					"&:hover": {
						backgroundColor: "gray",
					},
				}}
				onClick={handleEdit}
				disabled={isComplete}
			>
				{!edit ? "Edit" : "Save"}
			</Button>
			<Button
				variant="contained"
				size="large"
				sx={{
					color: "black",
					borderRadius: "0.5rem",
					boxShadow: 3,
					fontSize: "1rem",
					padding: "0.25rem 1rem",
					textTransform: "capitalize",
					fontWeight: "bold",
					backgroundColor: completed ? "gray" : "#D1D5DB",
					transition: "background-color 200ms", // Equivalent to duration-200
					"&:hover": {
						backgroundColor: "gray",
					},
				}}
				onClick={handleDelete}
				disabled={isComplete || deleting}
			>
				{deleting ? "Deleting..." : "Delete"}
			</Button>
		</div>
	);
}

Todo.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	completed: PropTypes.bool.isRequired,
	getTodosFromServer: PropTypes.func.isRequired,
};

export default Todo;
