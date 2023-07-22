const experss = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const tickets = require('./ticketRoutes');


router.use('/auth', authRoutes);
router.use('/tickets', tickets);