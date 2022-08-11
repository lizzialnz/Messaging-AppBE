const express = require('express');
const router = express.Router();


// const { authorizer } = require('./middlewares/authorizer');
// const { jwtAuthorizer } = require('./middlewares/jwtAuthorizer');

const usersRoutes = require('./users');
router.use('/users', usersRoutes);

// const vacunasRoutes = require('./vacunas');
// router.use('/vacunas', vacunasRoutes);

// const carnetRoutes = require('./carnet');
// router.use('/carnet', carnetRoutes);

// const citasRoutes = require('./citas');
// router.use('/citas', citasRoutes);

// const securityRoutes = require('./security');
// router.use('/auth', authorizer, securityRoutes);
module.exports = router;
