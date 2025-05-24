import { useState } from "react";
import pikachu from "../assets/pikachu.png";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Signup, setSignup] = useState("");
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    setError("");
    setError2("");

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
        return;
      }

      const data = await response.json();

      console.log("Resposta completa da API:", data);
      console.log("Token recebido:", data.acessToken);

      if (!data.acessToken || typeof data.acessToken !== "string") {
        throw new Error("acessToken não recebido ou formato inválido");
      }
      localStorage.setItem("token", data.acessToken);
      setToken(data.acessToken);

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
    } finally {
      setUsername("");
      setPassword("");
    }
  }
  async function handleSignUp() {
    setError("");
    setError2("");
    try {
      const response = await fetch(`http://localhost:8080/users`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userName: username, password }),
      });

      if (!response.ok) {
        setError2("The registration went wrong");
        return;
      } else {
        setSignup("Everything went good");
      }
    } catch (error) {
      setError2("username is already registreded");
    } finally {
      setUsername("");
      setPassword("");
      setSignup("");
    }
  }

  return (
    <div className="flex h-screen h-screen justify-center items-center bg-slate-500">
      <div className="flex flex-col justify-center gap-5 shadow-md items-center h-100 w-60 bg-white rounded-md">
        <img
          src={pikachu}
          alt="pikachu"
          className="h-40 hover:scale-110 transition-transform"
        />
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-50 border border-gray-300 rounded-md p-2"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-50 border border-gray-300 rounded-md p-2"
        />
        <div className="space-x-5">
          <button
            onClick={handleSubmit}
            className="w-20 h-10 rounded-md border border-gray-300 bg-blue-700 text-white shadow-md hover:scale-110 transition-transform"
          >
            {" "}
            ENTER{" "}
          </button>
          <button
            onClick={handleSignUp}
            className="w-20 h-10 rounded-md border border-gray-300 bg-green-700 text-white shadow-md hover:scale-110 transition-transform"
          >
            {" "}
            Sign up{" "}
          </button>
        </div>
        <div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {error2 && <p className="text-red-500 mt-2">{error2}</p>}
          {Signup && <p className="font-bold text-green-500 ">{Signup}</p>}
        </div>
      </div>
    </div>
  );
}
export default Login;
