const pokemonContainer = document.getElementById('pokemon-container');
const searchInput = document.getElementById('search-input');
const statusMessage = document.getElementById('status-message');

let allPokemon = [];

async function fetchPokemonData() {
  try {
    statusMessage.textContent = 'Cargando Pokémon...';
    statusMessage.classList.remove('error');

    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
    if (!response.ok) {
      throw new Error('No se pudo conectar con la API');
    }

    const data = await response.json();
    const pokemonList = data.results;

    const detailPromises = pokemonList.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      return res.json();
    });

    allPokemon = await Promise.all(detailPromises);
    statusMessage.textContent = '';
    displayPokemon(allPokemon);
  } catch (error) {
    statusMessage.textContent = 'Error al cargar los datos. Intenta nuevamente.';
    statusMessage.classList.add('error');
    console.error(error);
  }
}

function displayPokemon(pokemonList) {
  pokemonContainer.innerHTML = '';

  if (pokemonList.length === 0) {
    statusMessage.textContent = 'No se encontraron Pokémon.';
    return;
  }

  statusMessage.textContent = '';

  pokemonList.forEach((pokemon) => {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h3>${pokemon.name}</h3>
      <p>#${pokemon.id}</p>
    `;

    pokemonContainer.appendChild(card);
  });
}

function filterPokemon() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const filtered = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );
  displayPokemon(filtered);
}

searchInput.addEventListener('input', filterPokemon);

fetchPokemonData();