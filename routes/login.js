const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token'); // Importamos el modelo de Token
const { descifrarVigenere } = require('../middlewares/vigenere');
require('dotenv').config();
const mongoose = require('mongoose');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, rememberMe } = req.body;
  console.log(req.body);
  const clave = "TILININSANO"; 

  try {
    const usuario = await User.findOne({ correo: { $in: [email] } });

    if (usuario) {
      const passwordDescifrado = descifrarVigenere(usuario.pass, clave);
      console.log(`Contraseña cifrada en la BD: ${usuario.pass}`);
      console.log(`Contraseña descifrada: ${passwordDescifrado}`);
      console.log(`Contraseña ingresada: ${password}`);

      if (passwordDescifrado === password) {
        const tokenDuration = rememberMe ? '7d' : '1h';
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + (rememberMe ? 7 * 24 * 60 * 60 : 3600));

        const token = jwt.sign(
          { id: usuario._id, email: usuario.correo },
          process.env.JWT_SECRET,
          { expiresIn: tokenDuration }
        );

        // Guardar el token en la base de datos
        await Token.create({
          userId: usuario._id,
          token,
          expiresAt
        });

        res.status(200).json({ 
          message: 'Inicio de sesión exitoso', 
          usuario, 
          token
        });
      } else {
        res.status(401).send({ message: 'Contraseña incorrecta' });
      }
    } else {
      res.status(404).send({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error en el servidor', error });
  }
});

router.get('/token/:id', async (req, res) => {
  try {
      const userId = new mongoose.Types.ObjectId(req.params.id); // Convertir a ObjectId

      const token = await Token.findOne({ userId });

      if (token) {
          return res.status(204).send(); // Si hay un registro, no devolver nada (No Content)
      } else {
          return res.status(404).json({ error: 'No se encontró un token para este usuario' });
      }
  } catch (error) {
      console.error('Error al buscar el token:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
