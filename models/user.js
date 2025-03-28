const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: [String],
    required: true
  },
  apellido: {
    type: [String],
    required: true
  },
  telefono: {
    type: [String],
    required: true
  },
  correo: {
    type: [String],
    required: true,
    validate: {
      validator: function (emails) {
        return emails.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      },
      message: 'One or more emails are invalid.'
    }
  },
  pass: {
    type: String,
    required: true
  },
  edad: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);