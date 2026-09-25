const gamesContainer = document.getElementById('games-container');
const searchInput = document.getElementById('search-input');
const statusMessage = document.getElementById('status-message');
const variableInutil = 123; // Variable no usada para forzar un error de ESLint
let allGames = [];

async function fetchGamesData() {
  try {
    statusMessage.textContent = 'Cargando videojuegos...';
    statusMessage.classList.remove('error');

    const response = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=60');

    if (!response.ok) {
      throw new Error('No se pudo conectar con la API de videojuegos');
    }

    const data = await response.json();
    
    allGames = data.slice(0, 24).map((game) => ({
      id: game.dealID,
      title: game.title,
      price: game.normalPrice,
      salePrice: game.salePrice,
      thumb: game.thumb,
      rating: game.steamRatingText || 'Muy Positivo'
    }));

    statusMessage.textContent = '';
    displayGames(allGames);
  } catch (error) {
    statusMessage.textContent = 'Error al cargar los datos. Intenta nuevamente.';
    statusMessage.classList.add('error');
    console.error(error);
  }
}

function displayGames(gamesList) {
  gamesContainer.innerHTML = '';

  if (gamesList.length === 0) {
    statusMessage.textContent = 'No se encontraron videojuegos.';
    return;
  }

  statusMessage.textContent = '';

  gamesList.forEach((game) => {
    const card = document.createElement('div');
    card.classList.add('game-card');

    card.innerHTML = `
      <div>
        <img src="${game.thumb}" alt="${game.title}">
        <h3>${game.title}</h3>
        <span class="genre">Reseñas: ${game.rating}</span>
      </div>
      <p class="platform">Precio Habitual: $${game.price} USD</p>
    `;

    gamesContainer.appendChild(card);
  });
}

function filterGames() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const filtered = allGames.filter((game) =>
    game.title.toLowerCase().includes(searchTerm)
  );
  displayGames(filtered);
}

searchInput.addEventListener('input', filterGames);

fetchGamesData();