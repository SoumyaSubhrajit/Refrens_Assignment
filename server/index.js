const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const Ticket = require('./models/TambulaTicket');
const sampleTicket = require('./sampleTickets.json')
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');


dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));

// register API endpoint..
app.post('/register',)

// Verify email API endpoint
app.get('/verify-email',);




// lOGIN API endpoint.
app.post('/login',);



/* MONGOOSE SETUP */
const PORT = process.env.PORT || 4001;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
  })
  .catch((error) => console.log(`${error} didn't connect`));