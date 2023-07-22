const express = require('express');
const router = express.Router();
const authRoutes = require('./authroutes')

const tickets = require('./ticketRoutes');

router.use('/auth', authRoutes);
router.use('/tickets', tickets);

module.exports = router;