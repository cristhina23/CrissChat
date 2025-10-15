const router = require('express').Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const {
  createUser,
  handleLogin,
  handleLogout
} = require('../controllers/userCtrl');


router.post('/signup',
  /* #swagger.tags = ['Users']
   #swagger.description = 'Create new user' */
  asyncHandler(createUser));

router.post('/login', 
  /* #swagger.tags = ['Users']
   #swagger.description = 'Login user' */
  asyncHandler(handleLogin));

router.post('/logout', 
  /* #swagger.tags = ['Users']
   #swagger.description = 'Logout user' */
  asyncHandler(handleLogout));
  
  module.exports = router;