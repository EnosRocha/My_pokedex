import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { CheckCheck } from "lucide-react";
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

function Page({ token }) {
  const [pokemons, setPokemons] = useState([]);
  const [current, setCurrent] = useState(0);
  const [ShowModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [pokemonsData, setPokemonsData] = useState([]);
  const [locationArea, setLocationArea] = useState([]);
  const [evolutions, setEvolution] = useState([]);
  const navigate = useNavigate();

  async function addFisrtToUser(pokemons) {
    try {
      const userName = getUserNameFromToken(token);
      console.log(userName);
      console.log(token);
      const sendToBackEndApi = await fetch(`http://localhost:8080/addFirst`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pokemons, userName }),
      });
      if (sendToBackEndApi.ok) {
        navigate("/userpokedex");
      }
    } catch (error) {
      console.warn(`Error was found while trying to fetch the pokemons`, error);
    }
  }

  function addPointToCurrent(input) {
    setCurrent((prev) => {
      if (input === "next") {
        return Math.min(prev + 1, pokemonsData.length - 1);
      } else if (input === "previous") {
        return Math.max(prev - 1, 0);
      }
    });
  }

  function cry() {
    const cryUrl = pokemonsData[current].cries.latest;
    const audio = new Audio(cryUrl);
    audio.play();
  }

  function addPokemonsToArray() {
    if (inputValue.trim() !== "") {
      setPokemons(inputValue.split(",").map((p) => p.trim().toLowerCase()));
      setInputValue("");
    }
  }

  async function fetchPokemon(pokemons) {
    try {
      const response = await Promise.all(
        pokemons.map(async (pokemon) => {
          const pokemonData = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemon}`
          );

          if (!pokemonData.ok) {
            console.warn(`Pokemon ${pokemon} not found`);
            return null;
          }

          const data = await pokemonData.json();
          return data;
        })
      );
      const habitat = await Promise.all(
        pokemons.map(async (pokemon) => {
          const pokemonLocationArea = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemon}/encounters`
          );
          if (!pokemonLocationArea.ok) {
            console.warn(`Location Area of ${pokemon} not found`);
            return null;
          }
          const data = await pokemonLocationArea.json();
          console.log(data);
          return data;
        })
      );

      const validPokemons = response.filter((p) => p !== null);
      const validHabitat = habitat.filter((p) => p !== null);
      setPokemonsData(validPokemons);
      setLocationArea(validHabitat);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao buscar pokemons", error);
    }
  }
  async function fetchEvolution(pokemonsData) {
    const evolutionData = await Promise.all(
      pokemonsData.map(async (pokemon) => {
        const evolutionSpecies = await fetch(pokemon.species.url);
        if (!evolutionSpecies.ok) {
          console.warn(`Pokemon ${pokemon.name} not found`);
          return null;
        }

        const speciesData = await evolutionSpecies.json();
        const evolutionUrl = speciesData.evolution_chain.url;
        const evolutionResponse = await fetch(evolutionUrl);

        if (!evolutionResponse.ok) {
          console.warn(`Evolution chain of ${pokemon.name} not found`);
        }
        const evolutionFinalData = await evolutionResponse.json();
        const evolvesTo = evolutionFinalData.chain;
        function getPokemonsEvoltution(evolutionChain, evolutions = []) {
          evolutions.push(evolutionChain.species.name);

          if (evolutionChain.evolves_to) {
            evolutionChain.evolves_to.forEach((nextEvolution) => {
              getPokemonsEvoltution(nextEvolution, evolutions);
            });
          }
          return evolutions;
        }
        const evolutionList = getPokemonsEvoltution(evolvesTo);
        return evolutionList;
      })
    );
    const evolvedPokemonData = await Promise.all(
      evolutionData.map(async (evolution_chain) => {
        const eachPokemonData = await Promise.all(
          evolution_chain.map(async (pokemonName) => {
            const evolvedInfo = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`
            );
            if (!evolvedInfo.ok) {
              console.warn(`Infomation about ${pokemonName} not found`);
              return null;
            }
            const evolvedData = await evolvedInfo.json();
            return evolvedData;
          })
        );
        return eachPokemonData.filter((p) => p !== null);
      })
    );
    setEvolution(evolvedPokemonData);
    console.log(evolvedPokemonData);
  }

  useEffect(() => {
    fetchPokemon(pokemons);
  }, [pokemons]);
  useEffect(() => {
    fetchEvolution(pokemonsData);
  }, [pokemonsData]);
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-orange-500">
      <div className="absolute w-[400px] h-40 bg-blue-400 border-2 rounded-md flex justify-center items-center space-x-5">
        <input
          placeholder=" ex: charizard"
          className="h-10 w-60 bg-white rounded-[8px] border-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="bg-white h-10 w-20 rounded-md border-2 hover:scale-110 active:scale-90 transition-transform"
          onClick={() => addPokemonsToArray()}
        >
          {" "}
          GO{" "}
        </button>
      </div>
      {ShowModal && pokemonsData.length > 0 && pokemonsData[current] && (
        <div className="absolute h-[500px] w-[800px] bg-red-500 rounded-[20px] flex">
          <div className="absolute top-10 left-10 bg-white h-40 w-30 rounded-md border-2">
            <img
              className="h-full"
              src={pokemonsData[current].sprites.front_default}
              alt={pokemonsData[current].species.name}
            />
          </div>
          <div className="absolute bg-white top-10 left-45 h-40 w-[600px] p-2  flex flex-col flex-wrap rounded-[10px]">
            <p>
              Nome: {pokemonsData[current].name}, (id:{" "}
              {pokemonsData[current].id})
            </p>
            <p>
              Tipo:{" "}
              {pokemonsData[current].types.map((p) => p.type.name).join(",")}
            </p>
            <p>Base de experiencia: {pokemonsData[current].base_experience}</p>
            <p>Altura: {pokemonsData[current].height}</p>
            <p>Peso: {pokemonsData[current].weight}</p>
            <p>
              Habilidades:{" "}
              {pokemonsData[current].abilities
                .map((p) => p.ability.name)
                .slice(0, 2)
                .join(",")}
            </p>
            <div className="absolute p-2 top-1 left-70 flex flex-col flex-wrap capitalize space-y-1 h-40 space-x-6">
              {pokemonsData[current].stats.map((p, index) => (
                <div key={index}>{`${p.stat.name}: ${p.base_stat}`}</div>
              ))}
            </div>
          </div>
          <div
            onClick={() => cry()}
            className="absolute bg-white h-15 w-30 rounded-md top-55 left-10 hover:scale-110 active:scale-90 transition-transform flex justify-center items-center font-bold border-2"
          >
            {" "}
            Cry Sound{" "}
          </div>
          <div className="bg-white h-15 w-[600px] rounded-md absolute top-55 left-45 flex flex-wrap justify-center items-center">
            <div className="relative font-bold capitalize">Location Areas:</div>
            {locationArea?.length > 0
              ? locationArea[current].slice(0, 3).map((p, id) => (
                  <div className=" capitalize" key={id}>
                    {p.location_area.name + ","}
                  </div>
                ))
              : "No location found"}
          </div>
          <div className="absolute flex top-75 left-10 bg-white h-40 w-[600px] rounded-md border-2 space-x-4 items-center justify-center">
            {evolutions.length > 0
              ? evolutions[current]
                  .map((p, id) => {
                    return (
                      <div
                        key={id}
                        className="flex justify-center items-center flex-wrap gap-1"
                      >
                        <div className=" flex h-40 w-25 flex-col justify-center items-center">
                          <img
                            className="h-full"
                            src={p.sprites.front_default}
                            alt={p.name}
                          />
                          <p className=" font-bold ">{p.species.name}</p>
                        </div>
                        {id !== evolutions[current].length - 1 && (
                          <p className="font-bold">Evolves to</p>
                        )}
                      </div>
                    );
                  })
                  .slice(0, 3)
              : "not found"}
          </div>
          <div
            onClick={() => addPointToCurrent("previous")}
            className="absolute h-7 w-10 rounded-md bg-amber-50 top-75 left-168 flex justify-center hover:scale-110 active:scale-90"
          >
            {"<<"}
          </div>
          <div
            onClick={() => addPointToCurrent("next")}
            className="absolute h-7 w-10 rounded-md bg-amber-50 top-75 left-180 flex justify-center hover:scale-110 active:scale-90"
          >
            {">>"}
          </div>
          <div
            title="Take the pokemons you searched for"
            onClick={() => addFisrtToUser(pokemons)}
            className="absolute h-10 w-10 rounded-md bg-amber-50 top-85 left-168 flex p-1 flex-wrap justify-center items-center hover:scale-110 active:scale-90"
          >
            <Check />
          </div>
          <div
            title="Take all the pokemons, including de evolutions"
            onClick={() => addFisrtToUser(pokemons)}
            className="absolute h-10 w-10 rounded-md bg-amber-50 top-85 left-180 flex p-1 flex-wrap justify-center items-center hover:scale-110 active:scale-90"
          >
            <CheckCheck />
          </div>
        </div>
      )}
    </div>
  );
}
export default Page;
