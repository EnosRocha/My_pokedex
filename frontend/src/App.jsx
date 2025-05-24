import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Adminpokedex from "./pages/Adminpokedex";
import Userpokedex from "./pages/Userpokedex";
import Setupuser from "./pages/Setupuser";
import Listpokemons from "./pages/Lispokemons";

function App() {
  const [token, setToken] = useState(localStorage.getItem("acessToken"));
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/adminpokedex" element={<Adminpokedex token={token} />} />
        <Route path="/userpokedex" element={<Userpokedex token={token} />} />
        <Route path="/setupuser" element={<Setupuser token={token}/>} />
        <Route path="/listpokemons" element={<Listpokemons token={token}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
