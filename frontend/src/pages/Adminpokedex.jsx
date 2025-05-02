import { useEffect, useState } from "react";
import pokemons from "../assets/pokemons.jpg";
import pokemons2 from "../assets/pokemons2.png";
import pokemons3 from "../assets/pokemons3.png";
import { useNavigate } from "react-router-dom";
import Setupuser from "./Setupuser";
import Listpokemons from "./Lispokemons";

function Adminpokedex({ token }) {
  const images = [pokemons, pokemons2, pokemons3];
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col h-screen justify-center items-center bg-cover bg-center transition-all duration-1000 relative"
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <div className="flex flex-col items-center justify-center relative z-10">
        <div className="flex justify-center">
        </div>
        <div className="flex gap-60 mt-5">
          <div className="flex justify-center items-center h-48 w-48 bg-white rounded-full shadow-xl hover:scale-110 transition-transform hover:bg-orange-400">
            <h1 className="font-semibold">List all users</h1>
          </div>
          <div
            className="flex justify-center items-center h-48 w-48 bg-white rounded-full shadow-xl hover:scale-110 transition-transform hover:bg-green-400"
            onClick={() => navigate("/listpokemons")}
          >
            <h1 className="font-semibold">List all pokemons</h1>
          </div>
        </div>
        <div className="mt-5">
        </div>
      </div>
    </div>
  );
}

export default Adminpokedex;
