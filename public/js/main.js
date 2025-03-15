document.addEventListener('DOMContentLoaded', function() {
  // Verificamos si estamos en una página de detalles de un Pokemon e inicializamos el botón de favoritos
  const favoriteBtn = document.getElementById('favoriteBtn');
  if (favoriteBtn) {
    initializeFavoriteButton(favoriteBtn);
  }
});
  
// Función para inicializar el botón de favoritos
function initializeFavoriteButton(button) {
  // Obtenemos los favoritos almacenados
  const favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
  
  // Obtenemos los datos del Pokemon desde los atributos data del botón
  const pokemonId = button.dataset.id;
  const pokemonName = button.dataset.name;
  const pokemonImage = button.dataset.image;
  
  // Verificamos si este Pokemon ya es un favorito
  const isFavorite = favorites.some(fav => fav.id == pokemonId);
  
  if (isFavorite) {
    button.textContent = '★ Favorite';
    button.classList.remove('btn-outline-warning');
    button.classList.add('btn-warning');
  }
  
  button.addEventListener('click', function() {
    toggleFavorite(pokemonId, pokemonName, pokemonImage);
  });
}
  
// Función para añadir o eliminar un Pokemon de favoritos
function toggleFavorite(id, name, imageUrl) {
  // Obtenemos los favoritos actuales
  const favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
  const button = document.getElementById('favoriteBtn');
  
  // Verificamos si el Pokemon ya está en favoritos
  const favIndex = favorites.findIndex(fav => fav.id == id);
  
  if (favIndex !== -1) {
    // Lo eliminamos de los favoritos
    favorites.splice(favIndex, 1);
    button.textContent = '☆ Add to Favorites';
    button.classList.remove('btn-warning');
    button.classList.add('btn-outline-warning');
    
    showStatusMessage(`${formatName(name)} removed from favorites`);
  } else {
    // Lo añadimos a los favoritos
    favorites.push({ id, name, image_url: imageUrl });
    button.textContent = '★ Favorito';
    button.classList.remove('btn-outline-warning');
    button.classList.add('btn-warning');
    
    showStatusMessage(`${formatName(name)} added to favorites`);
  }
  
  // Guardamos los favoritos actualizados en localStorage
  localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
}
  
// Función para mostrar un mensaje de estado
function showStatusMessage(message) {
  const statusText = document.getElementById('status-text');
  if (statusText) {
    const originalMessage = statusText.textContent;
    statusText.textContent = message;
    
  }
}

// Función para dar formato al nombre de un Pokemon
function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}