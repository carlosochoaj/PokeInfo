const express = require('express');
const path = require('path');
const { initializeDatabase } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializamos la base de datos
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully');
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

// Configuramos la plantilla
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try using a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});