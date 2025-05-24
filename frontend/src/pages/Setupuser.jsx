import { useState } from "react";
import psyduck from "../assets/psyduck.png"
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      const response = await fetch(`http://localhost:8080/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("invalid password or username");
      }

      const data = await response.json();
      localStorage.setItem("acessToken", data.acessToken);
      setToken(data.token);

      const decoded = jwtDecode(data.acessToken);
      console.log("Decoded JWT:", decoded);

      if (decoded.scope.toUpperCase() === "ADMIN") {
        navigate("/adminpokedex");
      } else {
        navigate("/userpokedex");
      }
    } catch (error) {
      setError("Login failed. PLease try again");
      console.log("Error na requisicao:", error);
      return;
    }
  }

  return (
    <div className="flex h-screen h-screen justify-center items-center bg-slate-500">
      <div className="flex flex-col justify-center gap-5 shadow-md items-center h-100 w-60 bg-white rounded-md">
        <img src={psyduck} alt="psyduck" className="h-40" />
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-50 border border-gray-300 rounded-md p-2"
        />
        <input
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-50 border border-gray-300 rounded-md p-2"
        />
        <button
          onClick={handleSubmit}
          className="w-50 h-10 rounded-md border border-gray-300 bg-blue-700 text-white shadow-md hover:scale-110 transition-transform"
        >
          {" "}
          ENTER{" "}
        </button>
        {error && <p className="text-red mt-2">{error}</p>}
      </div>
    </div>
  );
}
export default Login;
