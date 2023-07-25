const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ticket = require('../models/TambulaTicket');
const sampleTicketsJSON = require('../sampleTickets.json')
const TambulaTicket = require('../models/TambulaTicket')

// Helper function to generate a unique tambula ticket
function generateTambulaTicket() {
  const ticketsData = Object.values(sampleTicketsJSON.tickets);
  const randomIndex = Math.floor(Math.random() * ticketsData.length);
  return JSON.parse(JSON.stringify(ticketsData[randomIndex]));
}

// Create Tambula ticket API endpoint
const createTickets = async (req, res) => {
  const { numberOfTickets } = req.body;

  try {
    if (!Number.isInteger(numberOfTickets) || numberOfTickets <= 0) {
      return res.status(400).json({ error: 'Invalid number of tickets' });
    }

    const generatedTickets = [];

    for (let i = 0; i < numberOfTickets; i++) {
      const ticketData = generateTambulaTicket();
      const ticket = new TambulaTicket({ ticket: ticketData });
      await ticket.save();
      generatedTickets.push(ticket);
    }

    res.json({ message: `${numberOfTickets} Tambula ticket(s) created successfully`, tickets: generatedTickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = createTickets;

// addigng here something
// Adding something here.