import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import Todo from "./components/Todo";
import bg_img from "./assets/skyline.jpg";
import { Link, useNavigate } from "react-router-dom";

function App() {
	const navigate = useNavigate();
	const [todoInfo, setTodoInfo] = useState([]);
	const [page, setPage] = useState(1);
	const [totalTodoPages, setTotalTodoPages] = useState(1);
	const getTodosFromServer = async function () {
		const res = await fetch(
			`http://localhost:5000/api/todos?page=${page}&limit=5`,
			{
				headers: {
					credentials: "include", // Include cookies in the request
					Authorization: `Bearer ${JSON.parse(
						localStorage.getItem("accessToken"),
					)}`,
				},
			},
		);
		const todos = await res.json();
		console.log(res);

		setTodoInfo(todos.data);
		console.log(todos);

		setTotalTodoPages(Math.ceil(todos.todos / 5));
	};
	useEffect(() => {
		getTodosFromServer();
	}, [page]);

	const handleLogout = async () => {
		await fetch(`http://localhost:5000/api/user/logout`, {
			method: "POST",
			headers: {
				credentials: "include", // Include cookies in the request, but this is not including cookies.
				Authorization: `Bearer ${JSON.parse(
					localStorage.getItem("accessToken"),
				)}`,
			},
		});
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		navigate("/");
	};
	// console.log(todoInfo);

	/*
	Sure, here's a boiled-down summary for future reference:

1. **Immutability in State Updates:** Always update state immutably in React to ensure predictable component rendering and state management.

2. **Functional Updates:** Use functional updates (`setState((prev) => ...)` syntax) when updating state based on previous state. This helps in avoiding stale state references.

3. **Avoid Immediate State Dependency in Logs:** React's state updates are asynchronous, so avoid depending on state values immediately after setting state (`console.log`, etc.). Use `useEffect` with state dependencies to log updated state values reliably.

4. **Predictable Rendering:** Ensure state updates trigger re-renders correctly by updating state immutably and handling state dependencies effectively.

By following these principles, you'll maintain clean and efficient state management practices in your React applications.
  */

	// use this approach, create new changes

	// in useffect if there is an empty array, then it runs once, if it no array, it runs everytime

	return (
		<div
			className="w-screen h-screen bg-cover flex justify-center items-center flex-col overflow-x-hidden overflow-y-scroll scrollbar-none relative"
			style={{ backgroundImage: `url(${bg_img})` }}
		>
			<Link
				to={"/"}
				className=" absolute top-2 right-2 text-md text-white font-semibold bg-black px-4 py-2 rounded-md hover:bg-gray-800 duration-300"
				onClick={handleLogout}
			>
				Logout
			</Link>
			<div className="flex justify-center items-center flex-col gap-y-2">
				<TodoForm getTodosFromServer={getTodosFromServer} />
				<div className="flex flex-col items-center container__self">
					{todoInfo.map((td) => {
						const { id, title, completed } = td;
						return (
							<div
								key={id}
								className="w-full"
							>
								<Todo
									id={id}
									title={title}
									completed={completed}
									getTodosFromServer={getTodosFromServer}
								/>
							</div>
						);
					})}
				</div>
				<div className="flex w-full justify-between">
					<button
						className="text-white bg-gray-600 px-4 py-2 rounded-xl hover:bg-gray-700 duration-300"
						onClick={() => {
							setPage((prev) => {
								if (prev > 1) {
									return prev - 1;
								}
								return prev;
							});
						}}
					>
						Previous Page
					</button>

					<div className="flex justify-between min-w-min gap-x-1 cursor-default">
						{totalTodoPages > 0 &&
							[...new Array(totalTodoPages)].map((_, i) => {
								return (
									<div
										className={`text-white ${
											page !== i + 1 ? "bg-gray-600" : "bg-gray-700"
										} aspect-square text-center pt-2 h-10 rounded-md text-sm duration-300`}
										key={i * 23}
										value={i + 1}
									>
										{i + 1}
									</div>
								);
							})}
					</div>

					<button
						className="text-white bg-gray-600 px-4 py-2 rounded-xl hover:bg-gray-700 duration-300"
						onClick={() => {
							setPage((prev) => {
								if (prev < totalTodoPages) {
									return prev + 1;
								}
								return prev;
							});
						}}
					>
						Next Page
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
