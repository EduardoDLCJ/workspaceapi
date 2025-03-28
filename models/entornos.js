const mongoose = require('mongoose');

const entornoSchema = new mongoose.Schema({
    Usuario_idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    Nombre: { type: String, required: true },
    playlist: { type: [String] },
    horario: { type: Date, required: true },
    horarioFin: { type: Date, required: true },
    icono: { type: String}
});

module.exports = mongoose.model('Entorno', entornoSchema);