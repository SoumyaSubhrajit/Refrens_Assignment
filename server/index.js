const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
import User from './models/User'


dotenv.config();
const app = express();

app.use(bodyParser.json());


// register API endpoint..
app.post('/register', (req, res) => {
  const { username, password, email } = req.body

  try {
    // Check if the email is already rgistered.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: `Email is already registered`
      })
    }

    // Generate a verification token..
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION_TIME     //Token expiration time
    })
    // Create a new user..
    const newUser = new User({
      username,
      password,
      email,
      verificationToken
    })

  }
})




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