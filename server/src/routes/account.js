const express = require('express');
const account_router = express.Router();
const verifyToken = require('../middleware/auth')
const AccountController = require('../controller/AccountController')
account_router.post('/login', AccountController.login)

account_router.post('/register', verifyToken, AccountController.register);

account_router.post('/forgot-password',AccountController.forgetPassword)
module.exports =account_router