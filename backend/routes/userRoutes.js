const router = require('express').Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const {
  createUser,
  handleLogin
} = require('../controllers/userCtrl');


router.post('/',
  /* #swagger.tags = ['Users']
   #swagger.description = 'Create new user' */
  asyncHandler(createUser));

router.post('/login', 
  /* #swagger.tags = ['Users']
   #swagger.description = 'Login user' */
  asyncHandler(handleLogin));
  
  module.exports = router;