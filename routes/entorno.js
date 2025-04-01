const express = require('express');
const router = express.Router();
const Entorno = require('../models/entornos'); // Modelo de Entorno
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/verifyToken');

// Endpoint para crear un nuevo entorno
router.post('/', verifyToken, async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body); // 🛠️ Verifica los datos enviados

        if (!req.body.Usuario_idUsuario || !mongoose.Types.ObjectId.isValid(req.body.Usuario_idUsuario)) {
            return res.status(400).json({ message: 'ID de usuario no válido' });
        }

        const nuevoEntorno = new Entorno({
            ...req.body,
            Usuario_idUsuario: new mongoose.Types.ObjectId(req.body.Usuario_idUsuario),
        });

        const entornoGuardado = await nuevoEntorno.save();
        res.status(201).json(entornoGuardado);
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error al crear el entorno', error });
    }
});



// Endpoint para editar un entorno por ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID del entorno desde los parámetros de la URL
        const entornoActualizado = await Entorno.findByIdAndUpdate(id, req.body, { new: true }); // Actualiza el entorno
        if (!entornoActualizado) {
            return res.status(404).json({ message: 'Entorno no encontrado' });
        }
        res.status(200).json(entornoActualizado); // Devuelve el entorno actualizado
    } catch (error) {
        res.status(500).json({ message: 'Error al editar el entorno', error });
    }
});

// Endpoint para eliminar un entorno por ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID del entorno desde los parámetros de la URL
        const entornoEliminado = await Entorno.findByIdAndDelete(id); // Elimina el entorno
        if (!entornoEliminado) {
            return res.status(404).json({ message: 'Entorno no encontrado' });
        }
        res.status(200).json({ message: 'Entorno eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el entorno', error });
    }
});

// Endpoint para obtener entornos por el ObjectId de un usuario
router.get('/usuario/:Usuario_idUsuario',  async (req, res) => {
    try {
        const { Usuario_idUsuario } = req.params;

        // Validar si es un ObjectId válido antes de convertirlo
        if (!mongoose.Types.ObjectId.isValid(Usuario_idUsuario)) {
            return res.status(400).json({ message: 'ID de usuario no válido' });
        }

        const usuarioObjectId = new mongoose.Types.ObjectId(Usuario_idUsuario);

        const entornos = await Entorno.find({ Usuario_idUsuario: usuarioObjectId });

        if (!entornos.length) {
            return res.status(404).json({ message: 'No se encontraron entornos para este usuario' });
        }

        res.status(200).json(entornos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los entornos', error });
    }
});


module.exports = router;