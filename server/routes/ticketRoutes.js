const express = require('express')
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/createtickets', ticketController.createTickets)

router.get('/fetchtickets/:id', ticketController.fetchtickets)

module.exports = router;