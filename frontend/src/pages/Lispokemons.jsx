import { useEffect, useState } from "react";

function Listpokemons({ token }) {
  const [offset, setOffset] = useState(0);
  const [pokemons, setPokemons] = useState([]);
  const limit = 50;

  async function fetchData() {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();

      const detailsPokemons = await Promise.all(
        data.results.map(async (pokemon) => {
          const finalRes = await fetch(pokemon.url);
          return finalRes.json();
        })
      );
      setPokemons(detailsPokemons);
    } catch (error) {
      console.log("pokemons not found", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [offset]);

  function nextPage() {
    setOffset((prev) => prev + limit);
  }

  function prevPage() {
    if (offset >= limit) {
      setOffset((prev) => prev - limit);
    }
  }

  return (
    <div className="flex flex-wrap bg-amber-600 h-full p-10 gap-3 justify-center items-center">
      {pokemons.map((pokemon) => (
        <div
          key={pokemon.id}
          className="flex flex-col justify-center shadow-md items-center h-70 w-50 bg-white rounded-md p-4"
        >
          <h1 className="capitalize">{pokemon.name}</h1>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p><strong>Tipos:</strong> {pokemon.types.map((e) => e.type.name).join(", ")}</p>
          <p><strong>Peso:</strong> {pokemon.weight}</p>
          <p><strong>Altura:</strong> {pokemon.height}</p>
        </div>
      ))}
      <div className="w-full flex justify-center gap-4 mt-4">
        <button onClick={prevPage} className="p-2 bg-white rounded-md hover:scale-110 transition-transform">Anterior</button>
        <button onClick={nextPage} className="p-2 bg-white rounded-md hover:scale-110 transition-transform">Próximo</button>
      </div>
    </div>
  );
}
export default Listpokemons;
