const express = require('express');
const router = express.Router();
const Usuario = require('../models/user'); // Asegúrate de que el modelo Usuario esté en esta ruta
const verifyToken = require('../middlewares/verifyToken');
// Endpoint para obtener todos los usuarios
router.get('/', verifyToken, async (req, res) => {
    try {
        const usuarios = await Usuario.find(); // Realiza un find en la base de datos
        res.status(200).json(usuarios); // Devuelve los usuarios en formato JSON
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
});

// Endpoint para editar un usuario por ID
router.put('/:id',verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUsuario = await Usuario.findByIdAndUpdate(id, req.body, { new: true }); // Actualiza el usuario
        if (!updatedUsuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(updatedUsuario); // Devuelve el usuario actualizado
    } catch (error) {
        res.status(500).json({ message: 'Error al editar el usuario', error });
    }
});

// Endpoint para eliminar un usuario por ID
router.delete('/:id',verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUsuario = await Usuario.findByIdAndDelete(id); // Elimina el usuario
        if (!deletedUsuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
});

module.exports = router;