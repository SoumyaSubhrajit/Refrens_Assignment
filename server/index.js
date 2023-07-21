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
    // sendVerificationEmail(email, verificationToken);

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
    const user = await User.find({ email });

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




// lOGIN API endpoint.
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password"
      })
    }

    // Compare the password with the hashed password.
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({
        error: "Invalid username ot password"
      })
    }
    // Generate a JWT token
    const token = jwt.sign({ usernmae: user.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION_TIME || "20d",
    })

    res.json({ token })
    res.status(201).json({
      status: "success",
      message: "Login successful"
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error."
    })
  }
})


// Helper function to generate random unique number for the ticket
function generateRandomUniqueNumber(usedNumbers) {
  const randomNum = Math.floor(Math.random() * 60) + 1
  if (!usedNumbers.has(randomNum)) {
    usedNumbers.add(randomNum);
    return randomNum;
  }
  return generateRandomUniqueNumber(usedNumbers);
}

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