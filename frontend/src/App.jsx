import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import Todo from "./components/Todo";
import bg_img from "./assets/skyline.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
	const navigate = useNavigate();
	const [todoInfo, setTodoInfo] = useState([]);
	const [page, setPage] = useState(1);
	const [totalTodoPages, setTotalTodoPages] = useState(1);

	const getTodosFromServer = async function () {
		const { data: todos } = await axios.get(
			`https://todo-list-app-backend-sandy.vercel.app/api/todos?page=${page}&limit=5`,
			{
				withCredentials: true,
			},
		);
		setTodoInfo(todos.data);
		setTotalTodoPages(Math.ceil(todos.todos / 5));
	};

	useEffect(() => {
		getTodosFromServer();
	}, [page]);

	const handleLogout = async () => {
		// axios.post(url[, data[, config]])
		await axios.post(
			`https://todo-list-app-backend-sandy.vercel.app/api/user/logout`,
			{},
			{
				withCredentials: true,
			},
		);
		navigate("/");
	};

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
