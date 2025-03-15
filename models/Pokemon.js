const axios = require('axios');
const { getPool } = require('../config/db');

class Pokemon {
  constructor() {
    // Mapeo de colores por tipo (igual que antes)
    this.typeColors = {
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
  }

  // Función para obtener un Pokemon por nombre o ID
  async getPokemon(nameOrId) {
    try {
      console.log(`Buscando Pokemon: ${nameOrId}`);
      
      // Primero intentamos obtenerlo de la base de datos
      const dbPokemon = await this.getPokemonFromDb(nameOrId);
      
      if (dbPokemon) {
        console.log(`Pokemon '${nameOrId}' encontrado en la base de datos.`);
        return { pokemon: dbPokemon, source: 'DB' };
      }
      
      console.log(`Pokemon '${nameOrId}' no está en la base de datos. Obteniendo de la API...`);
      
      // Si no está en la base de datos, lo obtenemos de la API
      const apiPokemon = await this.getPokemonFromApi(nameOrId);
      
      if (apiPokemon) {
        // Guardamos en la base de datos
        await this.savePokemonToDb(apiPokemon);
        return { pokemon: apiPokemon, source: 'API' };
      }
      
      return { pokemon: null, source: null, error: 'Pokemon no encontrado' };
    } catch (error) {
      console.error('Error en getPokemon:', error);
      return { pokemon: null, source: null, error: error.message };
    }
  }

  // Función para obtener todos los Pokemon de la base de datos
  async getPokemonFromDb(nameOrId) {
    try {
      const pool = await getPool();
      
      let query;
      let params;
      
      if (!isNaN(nameOrId)) {
        // Si es un número, buscamos por ID
        query = 'SELECT * FROM pokemon WHERE id = ?';
        params = [parseInt(nameOrId)];
      } else {
        // De lo contrario, buscamos por nombre
        query = 'SELECT * FROM pokemon WHERE name = ?';
        params = [nameOrId.toLowerCase()];
      }
      
      // Creamos la consulta a la base de datos
      const [rows] = await pool.query(query, params);
      
      if (rows.length > 0) {
        const pokemon = rows[0];
        return {
          id: pokemon.id,
          name: pokemon.name,
          height: pokemon.height,
          weight: pokemon.weight,
          types: pokemon.types,
          abilities: pokemon.abilities,
          image_url: pokemon.image_url
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo Pokemon de la base de datos:', error);
      return null;
    }
  }

  // Función para guardar un Pokemon en la base de datos
  async savePokemonToDb(pokemon) {
    try {
      const pool = await getPool();
      
      // Verificamos si el Pokemon ya existe
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM pokemon WHERE id = ?', [pokemon.id]);
      
      if (rows[0].count > 0) {
        console.log(`El Pokemon con ID ${pokemon.id} ya existe en la base de datos`);
        return true;
      }
      
      // Si no existe, lo guardamos
      await pool.query(
        `INSERT INTO pokemon 
         (id, name, height, weight, types, abilities, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          pokemon.id,
          pokemon.name,
          pokemon.height,
          pokemon.weight,
          pokemon.types,
          pokemon.abilities,
          pokemon.image_url
        ]
      );
      
      console.log(`Pokemon '${pokemon.name}' guardado en la base de datos.`);
      return true;
    } catch (error) {
      console.error('Error guardando Pokemon en la base de datos:', error);
      return false;
    }
  }

  // Función para obtener un Pokemon de la API
  async getPokemonFromApi(nameOrId) {
    try {
      console.log(`Obteniendo Pokemon '${nameOrId}' de PokeAPI...`);

      // Usamos Axios para hacer la petición a la API
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);
      
      if (response.status === 200) {
        const data = response.data;
        
        const pokemon = {
          id: data.id,
          name: data.name,
          height: data.height * 10, // Convertimos a cm
          weight: data.weight / 10,  // Convertimos a kg
          types: data.types.map(t => t.type.name).join(','),
          abilities: data.abilities.map(a => a.ability.name).join(','),
          image_url: data.sprites.other['official-artwork'].front_default || 
                    data.sprites.front_default
        };
        
        return pokemon;
      }
    } catch (error) {
      console.error(`Error obteniendo Pokemon de la API: ${error.message}`);
      return null;
    }
    
    return null;
  }

  // Función para obtener todos los Pokemon de la base de datos
  async getAllPokemon() {
    try {
      // Obtenemos la conexión a la base de datos
      const pool = await getPool();

      // Realizamos la consulta a la base de datos
      const [rows] = await pool.query('SELECT * FROM pokemon');
      
      return rows;
    } catch (error) {
      console.error('Error obteniendo todos los Pokemon de la base de datos:', error);
      return [];
    }
  }
}

module.exports = Pokemon;