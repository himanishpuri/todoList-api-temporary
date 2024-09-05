import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateNewToken = async function () {
	const navigate = useNavigate();
	try {
		await axios.get("http://localhost:5000/api/newToken", {
			withCredentials: true,
		});
	} catch (error) {
		navigate("/");
	}
};

export default CreateNewToken;
