const express = require('express');
const User = require('../models/user');
const { cifrarVigenere } = require('../middlewares/vigenere'); // Importa el módulo de Vigenere
const router = express.Router();
const cors = require('cors');

router.post('/', async (req, res) => {
  const { nombre, apellido, telefono, correo, pass, edad } = req.body;
  const rol = 'user';
  console.log(req.body);
  const clave = "TILININSANO"; // Cambia esto por una clave segura
  const passwordCifrado = cifrarVigenere(pass, clave);

  console.log(`Contraseña original: ${pass}`);
  console.log(`Contraseña cifrada: ${passwordCifrado}`);

  try {
    // Verificar si el correo o el teléfono ya están registrados
    const usuarioExistente = await User.findOne({
      $or: [{ correo }, { telefono }]
    });

    if (usuarioExistente) {
      return res.status(400).send({
        message: 'El correo o el teléfono ya están registrados',
        error: 'DUPLICATE_FIELDS'
      });
    }

    const nuevoUsuario = new User({
      nombre,
      apellido,
      telefono,
      correo,
      pass: passwordCifrado,
      edad,
      rol
    });

    await nuevoUsuario.save();
    res.status(201).send({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({ message: 'El correo electrónico ya está registrado', error });
    } else {
      res.status(500).send({ message: 'Error en el servidor', error });
    }
  }
});

module.exports = router;