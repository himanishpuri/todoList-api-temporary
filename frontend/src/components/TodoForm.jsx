import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TodoForm({ getTodosFromServer }) {
	const navigate = useNavigate();
	const [todoMsg, setTodoMsg] = useState("");
	const [adding, setAdding] = useState(false);

	const handleAdd = async function () {
		setAdding(true);
		if (todoMsg.trim().length === 0) return;
		try {
			await axios.post(
				"https://todo-list-app-xxh1.vercel.app/api/todos",
				{
					title: todoMsg.trim(),
					completed: false,
				},
				{
					withCredentials: true,
				},
			);
			await getTodosFromServer();
		} catch (error) {
			try {
				await axios.get(
					"https://todo-list-app-xxh1.vercel.app/api/newToken",
					{
						withCredentials: true,
					},
				);
				await handleAdd();
			} catch (error) {
				navigate("/");
			}
		} finally {
			setAdding(false);
		}
		setTodoMsg("");
	};

	return (
		<div className="bg-gray-600/70 flex justify-around p-4 rounded-xl items-center gap-x-5 w-screen max-w-2xl">
			<input
				className="w-10/12 rounded-lg px-4 py-2 placeholder:text-gray-400 placeholder:font-medium border-3 border-black"
				type="text"
				placeholder="TODO"
				value={todoMsg}
				onChange={(e) => setTodoMsg(e.currentTarget.value)}
			></input>
			<button
				className="bg-white text-black border-black border-2 rounded-lg px-3 py-2 font-semibold text-lg min-w-28 hover:border-white hover:bg-black hover:text-white duration-200"
				onClick={handleAdd}
				disabled={adding}
			>
				{adding ? "Adding..." : "Add"}
			</button>
		</div>
	);
}

TodoForm.propTypes = {
	getTodosFromServer: PropTypes.func.isRequired,
};

export default TodoForm;
