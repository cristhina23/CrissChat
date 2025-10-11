const router = require('express').Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const {
  createUser,
  handleLogin
} = require('../controllers/userCtrl');


router.post('/', asyncHandler(createUser));
router.post('/login', asyncHandler(handleLogin));
  
  module.exports = router;