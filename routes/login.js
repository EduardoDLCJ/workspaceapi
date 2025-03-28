const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ajusta el path según tu modelo
const { descifrarVigenere } = require('../middlewares/vigenere'); // Importa el módulo de Vigenere
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const clave = "TILININSANO"; // Debe ser la misma clave que usaste para cifrar

  try {
    // Busca un usuario cuyo array 'correo' contenga el valor de 'email'
    const usuario = await User.findOne({ correo: { $in: [email] } });

    if (usuario) {
      const passwordDescifrado = descifrarVigenere(usuario.pass, clave);
      console.log(`Contraseña cifrada en la BD: ${usuario.pass}`);
      console.log(`Contraseña descifrada: ${passwordDescifrado}`);
      console.log(`Contraseña ingresada: ${password}`);

      if (passwordDescifrado === password) {
        // Generar el token con una duración de 1 hora
        const token = jwt.sign(
          { id: usuario._id, email: usuario.correo }, // Datos que incluirás en el token
          process.env.JWT_SECRET, // Clave secreta desde las variables de entorno
          { expiresIn: '1h' } // Duración del token
        );

        res.status(200).json({ 
          message: 'Inicio de sesión exitoso', 
          usuario, 
          token // Enviar el token en la respuesta
        });
      } else {
        res.status(201).send({ message: 'Contraseña incorrecta' });
      }
    } else {
      res.status(404).send({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error en el servidor', error });
  }
});

module.exports = router;
