const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 4002;

const auth = require('./routes/auth');
const registro = require('./routes/registro');
const login = require('./routes/login');
const respaldos = require('./routes/respaldos/respaldos');
const usuarios = require('./routes/usuarios');
const entornos = require('./routes/entorno');
const recuperar = require('./routes/recuperar/recuperar');


console.log("Mongo URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.error('Error conectando a MongoDB:', error));

app.use(cors());
app.use(express.json());

app.use('/', auth);
app.use('/registro', registro);
app.use('/login', login);
app.use('/collections', respaldos);
app.use('/usuarios', usuarios);
app.use('/entornos', entornos);
app.use('/recuperar', recuperar);


// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor escuchando en puerto ${PORT}`));
