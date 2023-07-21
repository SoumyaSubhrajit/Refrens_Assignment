const mongoose = require('mongoose');

const tambulaTicketSchema = new mongoose.Schema({
  ticket: [
    // Array to store the numbers of the ticket
    [Number],
  ],
});

const sampleTicket = mongoose.model('sampleTicket', tambulaTicketSchema)

module.exports = sampleTicket;