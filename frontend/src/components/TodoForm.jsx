import { useState } from "react";
import PropTypes from "prop-types";

function TodoForm({ getTodosFromServer }) {
	const [todoMsg, setTodoMsg] = useState("");
	const header = new Headers();
	header.append("Content-Type", "");

	const handleAdd = async function () {
		if (todoMsg.trim().length === 0) return;
		setTodoMsg("");
		await fetch("http://localhost:5000/api/todos", {
			method: "POST",
			body: JSON.stringify({
				title: todoMsg.trim(),
				completed: false,
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${JSON.parse(
					localStorage.getItem("accessToken"),
				)}`,
			},
		});
		await getTodosFromServer();
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
				className="bg-white text-black border-black border-2 rounded-lg px-3 py-2 font-semibold text-lg hover:border-white hover:bg-black hover:text-white duration-200"
				onClick={handleAdd}
			>
				Add
			</button>
		</div>
	);
}

TodoForm.propTypes = {
	getTodosFromServer: PropTypes.func.isRequired,
};

export default TodoForm;
