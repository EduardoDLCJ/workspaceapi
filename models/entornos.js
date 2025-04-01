const mongoose = require('mongoose');

const entornoSchema = new mongoose.Schema({
    Usuario_idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    nombre: { type: String, required: true },
    playlist: { type: [String] },
    inicio: { type: Date, required: true },
    fin: { type: Date, required: true },
    icono: { type: String}
});

module.exports = mongoose.model('Entorno', entornoSchema);