const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
    select: false,
  },
  picture: {
    type: String,
  },
  newMessages: {
    type: Object,
    default: {},
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
}, { timestamps: true });

//  Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  Eliminar confirmPassword antes de guardar en DB
userSchema.pre('save', function (next) {
  this.confirmPassword = undefined;
  next();
});

//  Método para comparar contraseñas
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
