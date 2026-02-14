const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/check-cedula
// @desc    Check if user exists and get data from external API
// @access  Public
router.post('/check-cedula', authController.checkCedula);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

module.exports = router;
