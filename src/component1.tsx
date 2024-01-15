import React, { useState, useEffect } from 'react';
import "./styles.css";
import axios from 'axios';




interface Stat {
  name: string;
  value: number;
}

interface Pokemon {
  name: string;
  image: string;
  type: string;
  stats: Stat[];
  moves: string[];
}

function PokemonExplorer() {
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Pokemon[]>([]);


  async function fetchPokemonData(pokemonName: string) {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemon: Pokemon = {
        name: response.data.name.charAt(0).toUpperCase() + response.data.name.slice(1),
        image: response.data.sprites.front_default,
        type: response.data.types[0].type.name,
        stats: response.data.stats.map((stat: any) => ({
          name: stat.stat.name,
          value: stat.base_stat
        })),
        moves: response.data.moves.slice(0, 5).map((move: any) => move.move.name)
      };
      setPokemonData(pokemon);
    } catch (error) {
      console.error(error);
      setPokemonData(null);
    }
  }


  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }


  function handleAddToFavorites() {
    if (pokemonData !== null) {
      setFavorites(favorites => [...favorites, pokemonData]);
    }
  }


  function handleFavoriteClick(pokemon: Pokemon) {
    setPokemonData(pokemon);
  }


  useEffect(() => {
    fetchPokemonData('bulbasaur');
  }, []);


  useEffect(() => {
    if (searchQuery !== '') {
      fetchPokemonData(searchQuery.toLowerCase());
    }
  }, [searchQuery]);

  return (
    <div>
      <h3>Pokemon Explorer</h3>
      <p><b>Search Pokemon</b></p>
      <input type="text" value={searchQuery} onChange={handleSearchInputChange} />
      {pokemonData !== null ? (
        <div>
          <h2>{pokemonData.name}</h2>
          <img src={pokemonData.image} alt={pokemonData.name} />
          <p>Type: {pokemonData.type}</p>
          <ul>
            {pokemonData.stats.map(stat => (
              <li key={stat.name}>{stat.name}: {stat.value}</li>
            ))}
          </ul>
          <p>Moves: {pokemonData.moves.join(', ')}</p>
          <button onClick={handleAddToFavorites}>Add to Favorites</button>
        </div>
      ) : (
        <p>No Pokemon found.</p>
      )}
      <h2>Favorites</h2>
      <ul>
        {favorites.map(pokemon => (
          <li key={pokemon.name}>
            <button onClick={() => handleFavoriteClick(pokemon)}>
              {pokemon.name}
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
}


export default PokemonExplorer;
export { };
