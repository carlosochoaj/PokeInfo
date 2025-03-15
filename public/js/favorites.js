document.addEventListener('DOMContentLoaded', function() {
  // Cargamos los favoritos al cargar la página
  loadFavorites();
});

// Función para cargar los favoritos
function loadFavorites() {
  // Obtenemos los favoritos desde localStorage
  const favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
  const favoritesContainer = document.getElementById('favorites-container');
  const noFavoritesMessage = document.getElementById('no-favorites');
  
  // Mostramos un mensaje si no hay favoritos
  if (favorites.length === 0) {
    noFavoritesMessage.classList.remove('d-none');
    return;
  }
  
  // Ocultamos el mensaje que indica que no hay favoritos
  noFavoritesMessage.classList.add('d-none');
  
  favoritesContainer.innerHTML = '';
  
  // Agregamos una tarjeta por cada Pokemon
  favorites.forEach(pokemon => {
    const card = createPokemonCard(pokemon);
    favoritesContainer.appendChild(card);
  });
  }
  
// Función para crear una tarjeta de Pokemon
function createPokemonCard(pokemon) {

  const column = document.createElement('div');
  column.className = 'col';
  
  column.innerHTML = `
    <div class="card h-100 shadow-sm">
    <div class="card-header bg-light d-flex justify-content-between align-items-center">
      <h5 class="card-title m-0 text-primary">${formatName(pokemon.name)}</h5>
      <button class="btn btn-sm btn-danger remove-favorite" data-id="${pokemon.id}">
      <i class="bi bi-x-lg"></i> Remove
      </button>
    </div>
    <div class="card-body text-center">
      <img src="${pokemon.image_url}" alt="${pokemon.name}" class="img-fluid pokemon-thumbnail mb-3">
      <a href="/search?q=${pokemon.id}" class="btn btn-info w-100">Ver Detalles</a>
    </div>
    </div>
  `;
  
  const removeButton = column.querySelector('.remove-favorite');
  removeButton.addEventListener('click', function() {
    removeFavorite(pokemon.id);
  });
  
  return column;
  }
  
// Función para eliminar un Pokemon de favoritos
function removeFavorite(id) {
  // Obtenemos los favoritos actuales
  const favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
  
  // Buscamos el Pokemon en la lista de favoritos
  const favIndex = favorites.findIndex(fav => fav.id == id);
  
  if (favIndex !== -1) {
    const pokemonName = favorites[favIndex].name;
    
    // Lo eliminamos de los favoritos
    favorites.splice(favIndex, 1);
    
    // Guardamos los favoritos actualizados
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
    
    // Actualizamos la interfaz de usuario
    loadFavorites();
    
    // Mostramos un mensaje de estado
    const statusText = document.getElementById('status-text');
    statusText.textContent = `${formatName(pokemonName)} removed from favorites`;
    
  }
}

// Función para dar formato al nombre de un Pokemon
function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}