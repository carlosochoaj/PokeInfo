const express = require('express');
const router = express.Router();
const Pokemon = require('../models/Pokemon');

// Creamos una instancia del modelo Pokemon
const pokemonModel = new Pokemon();

// Obtenemos un Pokemon por nombre o ID
router.get('/pokemon/:nameOrId', async (req, res) => {
  try {
    // Obtenemos el nombre o ID del Pokemon desde los parámetros de la URL
    const { nameOrId } = req.params;
    const result = await pokemonModel.getPokemon(nameOrId);
    
    if (result.pokemon) {
      return res.json(result);
    } 
    
    return res.status(404).json({ 
      error: 'Pokemon not found', 
      pokemon: null, 
      source: null 
    });
  } catch (error) {
    console.error('Error in API:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      pokemon: null, 
      source: null 
    });
  }
});


// Obtenemos todos los Pokemon
router.get('/pokemon', async (req, res) => {
  try {
    const pokemon = await pokemonModel.getAllPokemon();
    res.json({ pokemon });
  } catch (error) {
    console.error('Error getting all Pokemon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;