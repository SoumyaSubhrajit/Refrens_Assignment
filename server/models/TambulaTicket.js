const mongoose = require('mongoose');

const tambulaTicketSchema = new mongoose.Schema({
  ticket: [
    // Array to store the numbers of the ticket
    [Number],
  ],
});

const TambulaTicket = mongoose.model('TambulaTicket ', tambulaTicketSchema)

module.exports = TambulaTicket;