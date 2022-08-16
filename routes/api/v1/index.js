const express = require('express');
const router = express.Router();


const { authorizer } = require('./middlewares/authorizer');
const { jwtAuthorizer } = require('./middlewares/jwtAuthorizer');

const usersRoutes = require('./users');
router.use('/users', usersRoutes);

const messageRoutes = require('./messages');
router.use('/message', messageRoutes);

const securityRoutes = require('./security');
router.use('/auth', authorizer, securityRoutes);
module.exports = router;
