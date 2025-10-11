const express = require('express');
const User = require('../models/User');

const createUser = async (req, res) => {
 const { email, password, picture } = req.body;

  const findUser = await User.findOne({ email: email.toLowerCase() });
  if (findUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ email, password, picture });
  res.status(201).json(user);

}

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // Validar que se envíen los campos
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password' });
  }

  // Buscar usuario por email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Comparar contraseña
  const isMatch = await user.isPasswordMatched(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Actualizar estado del usuario a "online"
  user.status = 'online';
  await user.save();

  // No devolver contraseña al frontend
  const userResponse = {
    id: user._id,
    email: user.email,
    picture: user.picture,
    status: user.status,
  };

  res.status(200).json({
    message: 'Login successful',
    user: userResponse,
  });
}

module.exports = { createUser, handleLogin };