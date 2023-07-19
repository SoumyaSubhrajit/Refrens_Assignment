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
app.post('/register', async (req, res) => {
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

    // Hash the password before saving the user.
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);
    newUser.password = hasedPassword;

    // Save the user to the database.
    await newUser.save();

    // Save a verification email.
    sendVerificationEmail(email, verificationToken);

    res.json({ message: 'User registred suucessfully' });
  } catch (error) {
    console.error(error);
    res.status | (500).json({ error: 'Internal server error' });
  }
})

// Verify email API endpoint
app.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    // Verify the token
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user with the given email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


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