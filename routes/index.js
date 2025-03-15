const express = require('express');
const router = express.Router();
const Pokemon = require('../models/Pokemon');

// Creamos una instancia del modelo Pokemon
const pokemonModel = new Pokemon();

// Página principal
router.get('/', (req, res) => {
  const suggestions = ['Pikachu', 'Charizard', 'Bulbasaur', 'Eevee', 'Mewtwo'];
  res.render('index', { suggestions });
});

// Buscamos el pokemon
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.redirect('/');
  }
  
  try {
    // Obtenemos el Pokemon desde la API
    const result = await pokemonModel.getPokemon(query.toLowerCase());
    
    if (result.pokemon) {
      // Definimos la función de colores de tipo para pasarla a la plantilla
      const getTypeColor = (type) => {
        const typeColors = {
          "normal": "#A8A878",
          "fire": "#F08030",
          "water": "#6890F0",
          "electric": "#F8D030",
          "grass": "#78C850",
          "ice": "#98D8D8",
          "fighting": "#C03028",
          "poison": "#A040A0",
          "ground": "#E0C068",
          "flying": "#A890F0",
          "psychic": "#F85888",
          "bug": "#A8B820",
          "rock": "#B8A038",
          "ghost": "#705898",
          "dragon": "#7038F8",
          "dark": "#705848",
          "steel": "#B8B8D0",
          "fairy": "#EE99AC"
        };
        return typeColors[type.toLowerCase()] || "#71A6D2";
      };
      
      return res.render('pokemon', { 
        pokemon: result.pokemon, 
        source: result.source,
        getTypeColor
      });
    } else {
      return res.render('index', { 
        error: result.error || 'Pokemon not found! Please try another name or ID.',
        suggestions: ['Pikachu', 'Charizard', 'Bulbasaur', 'Eevee', 'Mewtwo']
      });
    }
  } catch (error) {
    console.error(error);
    return res.render('index', { 
      error: 'An error occurred during search.',
      suggestions: ['Pikachu', 'Charizard', 'Bulbasaur', 'Eevee', 'Mewtwo']
    });
  }
});

// Página de favoritos
router.get('/favorites', (req, res) => {
  res.render('favorites');
});

module.exports = router;