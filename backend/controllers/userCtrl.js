const express = require('express');
const User = require('../models/User');

const createUser = async (req, res) => {
 const { email, password, confirmPassword, picture } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const findUser = await User.findOne({ email: email.toLowerCase() });
  if (findUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  
  const user = await User.create({ email, password,  picture, status: 'online' });
  
  const userResponse = {
      id: user._id,
      email: user.email,
      picture: user.picture,
      status: user.status,
      createdAt: user.createdAt,
    };

  res.status(201).json(userResponse);

}

const handleLogin = async (req, res) => {
  
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    // Buscar usuario e incluir la contraseña temporalmente
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Comparar contraseña
    const isMatch = await user.isPasswordMatched(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Actualizar estado del usuario
    user.status = 'online';
    await user.save();

    // Crear respuesta sin contraseña
    const userResponse = {
      id: user._id,
      email: user.email,
      picture: user.picture,
      status: user.status,
    };

    return res.status(200).json({
      message: 'Login successful',
      user: userResponse,
    });

};


module.exports = { createUser, handleLogin };