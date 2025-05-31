import { use, useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function getUserNameFromToken(token) {
  if (!token) {
    console.log("Token não fornecido");
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    return decoded.sub || null;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}

function Userpokedex({ token }) {
  const [name, setName] = useState("");
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonsData, setPokemonsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userPokemon, setUserPokemon] = useState([]);
  const [currentPokemon, setCurrentPokemon] = useState(0);
  const navigate = useNavigate();

  async function loadPokemons() {
    try {
      const userName = getUserNameFromToken(token);
      if (!userName) return;

      const response = await fetch(
        `http://localhost:8080/userPokemons?userName=${userName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const pokemons = await response.json();
        setUserPokemon(pokemons);
      }
    } catch (error) {
      console.error("Erro ao carregar POkemon:", error);
    }
  }
  useEffect(() => {
    loadPokemons();
  }, [token]);

  useEffect(() => {
    if (userPokemon.length > 0) {
      fetchAllPokemonsData(userPokemon);
    }
  }, [userPokemon]);

  function navigatePokemons(direction) {
    setCurrentPokemon((prev) => {
      if (direction === "next") {
        return (prev + 1) % pokemonsData.length;
      } else {
        return (prev - 1 + pokemonsData.length) % pokemonsData.length;
      }
    });
  }

  async function fetchPokemon(pokemonName) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

      if (!response.ok) {
        throw new Error("Pokemon nao encontrado");
      }
      const data = await response.json();
      setPokemonData(data);
      const userName = getUserNameFromToken(token);

      await fetch("http://localhost:8080/addPokemon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userName: userName, pokemonName: pokemonName }),
      });

      await loadPokemons();
      setShowModal(false);
    } catch (error) {
      console.error(error.message);
    }
  }
  function addPokemon(pokemonName) {
    fetchPokemon(pokemonName);
  }

  async function fetchAllPokemonsData(pokemonList) {
    try {
      console.log("Lista recebida:", pokemonList);
      const pokemonsWithImages = await Promise.all(
        pokemonList.map(async (pokemonName) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
          );

          if (!response.ok) {
            console.warn(`Pokemon ${pokemonName} não encontrado.`);
            return null;
          }

          const data = await response.json();
          return data;
        })
      );

      const validPokemons = pokemonsWithImages.filter((p) => p !== null);

      console.log("pokemons validos:", validPokemons);

      setPokemonsData(validPokemons);
    } catch (error) {
      console.error("Erro ao buscar dados dos Pokémons:", error);
    }
  }

  return (
    <div
      className="flex items-center bg-amber-600 h-screen w-screen overflow-x-hidden
    
    "
    >
      <div className="relative bg-red-600 h-220 w-155 rounded-[20px] shadow-2xl border-2 left-110">
        <div className="relative bg-red-600 h-218 w-155 rounded-[20px] shadow-2xl border-2 left-2"></div>
        <div className=" absolute bg-gray-200 w-30 h-30 rounded-full left-19 top-10 shadow-md border-2"></div>
        <div className=" absolute bg-blue-400 w-25 h-25 rounded-full top-13 left-22 border-2"></div>
        <div
          className=" absolute bg-blue-500
         w-20 h-20 rounded-full top-17 left-26"
        ></div>
        <div className=" absolute bg-blue-400 w-12 h-12 rounded-full top-18  left-26"></div>
        <div className=" absolute bg-white w-6 h-6 rounded-full top-20  left-28"></div>
        <div className=" absolute bg-red-500 w-6 h-6 rounded-full top-15  left-60 border-2"></div>
        <div className=" absolute bg-white w-2 h-2 rounded-full top-16  left-61 border-2"></div>
        <div className=" absolute bg-yellow-300 w-6 h-6 rounded-full top-15  left-75 border-2"></div>
        <div className=" absolute bg-white w-2 h-2 rounded-full top-16  left-76 border-2"></div>
        <div className=" absolute bg-green-500 w-6 h-6 rounded-full top-15  left-90 border-2"></div>
        <div className=" absolute bg-white w-2 h-2 rounded-full top-16  left-91 border-2"></div>
        {/*tela da pokedex */}
        <div className="absolute bg-neutral-500 h-100 w-100 top-60 left-20 shadow-md rounded-bl-[50px] rounded-[15px] border-2">
          <div className=" absolute bg-red-500 w-4 h-4 rounded-full top-4  left-35 border-3"></div>
          <div className=" absolute bg-red-500 w-4 h-4 rounded-full top-4  left-55 border-3"></div>
          <div
            className="absolute bg-white h-70 w-80 top-10 left-10 shadow-md rounded-[30px] border-2 flex justify-center
           items-center"
          >
            {pokemonsData.length > 0 ? (
              <img
                className=" h-60"
                src={pokemonsData[currentPokemon].sprites.front_default}
              />
            ) : (
              <p className="text-gray-500 text-center font-bold">
                {userPokemon.length === 0
                  ? "No Pokémon has been captured yet!"
                  : "Loading Pokémons..."}
              </p>
            )}
          </div>
          <div>
            <div className=" absolute bg-red-500 w-10 h-10 shadown-md rounded-full top-85  left-7 border-2"></div>

            <div className="screen botons and speakers">
              <div className=" absolute bg-gray-500 w-10 h-2 rounded-full top-85  left-70 border-3"></div>
              <div className=" absolute bg-gray-500 w-10 h-2 rounded-full top-88  left-70 border-3"></div>
              <div className=" absolute bg-gray-500 w-10 h-2 rounded-full top-91  left-70 border-3"></div>
              <div className=" absolute bg-gray-500 w-10 h-2 rounded-full top-94  left-70 border-3"></div>
            </div>
          </div>
        </div>
        <div className=" bottom nob">
          <div
            className=" absolute bg-green-950
             w-20 h-20 shadown-md rounded-full top-170  left-15 border-2 "
          ></div>
          <div
            className=" absolute bg-green-950
             w-20 h-20 shadown-md rounded-full top-169  left-16 border-2 hover:scale-110 active:scale-90"
            onClick={() => setShowModal(true)}
          ></div>
        </div>
        <div
          className=" absolute bg-red-700
             w-20 h-3 shadown-md rounded-full top-170  left-47 border-2 shadow-2xl"
        ></div>
        <div
          className=" absolute bg-blue-700
             w-20 h-3 shadown-md rounded-full top-170  left-75 border-2 shadow-2xl"
        ></div>
        <div
          className=" absolute bg-green-400
             w-48 h-20 shadown-md top-180 rounded-[10px]  left-47 border-2"
        ></div>
        <div
          className=" absolute bg-green-950
             w-10 h-15 shadown-md top-170 rounded-[5px]  left-122 border-2"
        ></div>
        <div
          className=" absolute bg-green-950
             w-10 h-15 shadown-md top-195 rounded-[5px]  left-122 border-2"
        ></div>
        <div
          className=" absolute bg-green-950
             w-15 h-10 shadown-md top-185 rounded-[5px]  left-107 border-2 hover:scale-110 active:scale-90"
          onClick={() => navigatePokemons("prev")}
        ></div>
        <div
          className=" absolute bg-green-950
             w-15 h-10 shadown-md top-185 rounded-[5px]  left-132 border-2 hover:scale-110 active:scale-90"
          onClick={() => navigatePokemons("next")}
        ></div>
        <div className="absolute bg-black w-85 h-1 top-45 left-2"></div>
        <div className="absolute bg-black w-87 h-0.5 top-48 left-2"></div>
        <div className="absolute bg-black w-59 h-1 top-31 left-98"></div>
        <div className="absolute bg-black w-18 h-1 top-38 left-84 rotate-130"></div>
        <div className="absolute bg-black w-21 h-0.5 top-40 left-85 rotate-130"></div>
        <div className="absolute w-18 h-185 bg-red-500 top-32 left-157 border-1"></div>
        <div className="absolute w-5 h-185 bg-red-300 top-32 left-160"></div>
        <div className="absolute w-18 h-2 bg-black top-32 left-157"></div>
        <div className="absolute w-18 h-2 bg-black top-215 left-157"></div>
        <div className="absolute w-18 h-2 bg-red-900 border-2 top-180 left-157"></div>
        <div className="absolute w-18 h-2 bg-red-900 border-2 top-75 left-157"></div>
        <div className="absolute bg-red-600 h-170 w-155 rounded-[20px] shadow-2xl border border-t-0 border-black left-175 top-50 rounded-t-none"></div>
        <div className="absolute bg-red-600 h-17 w-90 border border-b-0 border-black left-175 top-34 rounded-t-none "></div>
        <div
          onClick={() => navigate("/viewPokemons")}
          className="absolute bg-white h-22 w-42 rounded-md top-140 left-190 border-2 hover:scale-110 active:scale-90 transition-transform font-bold text-2xl p-5 flex flex-col justify-center items-center"
        >
          <p>Advanced </p>
          <p>search</p>
        </div>
        <div className="bg-white absolute h-50 w-[500px] top-60 left-190 rounded-md border-2">
          {pokemonsData.length > 0 ? (
            <div className="h-full w-full flex flex-wrap flex-col justify-center items-center font-bold text-2xl">
              <p>
                Nome: {pokemonsData[currentPokemon].name}, (id:{" "}
                {pokemonsData[currentPokemon].id})
              </p>
              <p>
                Tipo:{" "}
                {pokemonsData[currentPokemon].types
                  .map((p) => p.type.name)
                  .join(",")}
              </p>
              <p>
                Base de experiencia:{" "}
                {pokemonsData[currentPokemon].base_experience}
              </p>
              <p>Altura: {pokemonsData[currentPokemon].height}</p>
              <p>Peso: {pokemonsData[currentPokemon].weight}</p>
              <p>
                Habilidades:{" "}
                {pokemonsData[currentPokemon].abilities
                  .map((p) => p.ability.name)
                  .slice(0, 2)
                  .join(",")}
              </p>
            </div>
          ) : (
            <div className="h-full w-full font-bold flex justify-center items-center">
              "No information about pokemons provided yet"
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center ">
            <div className="bg-white p-6 rounded shadow-lg h-60 w-70 flex flex-col ">
              <h2 className="text-xl font-bold mb-4">
                Enter just one Pokemon name at a time
              </h2>
              <input
                type="text"
                placeholder="Ex: pikachu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 mb-4 rounded-[10px] w-full"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded h-10 w-30 transition-transform hover:scale-110 active:scale-90"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addPokemon(name)}
                  className="bg-blue-500 text-white px-4 py-2 rounded h-10 w-30 transition-transform hover:scale-110 active:scale-90"
                >
                  Enter
                </button>
              </div>
            </div>
          </div>
        )}
        {pokemonData && (
          <div
            className="absolute top-50 left-120 h-90 w-90 bg-white p-2 rounded shadow-lg flex flex-col justify-center items-center animate-bounce"
            onClick={() => setPokemonData(null)}
          >
            <h3 className=" text-3xl font font-bold capitalize">
              {pokemonData.name}
            </h3>
            <img
              className="w-60"
              src={pokemonData.sprites.front_default}
              alt={pokemonData.name}
            />
            <p className="text-3xl text-green-700"> Pokemon added!</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default Userpokedex;
