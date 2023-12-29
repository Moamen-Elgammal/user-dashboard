const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const UserInfo = require('./models/UserInfo');
const UserIdentety = require('./models/Identefier');
const GoogleLogin = require('./models/GoogleLogin');
const { OAuth2Client } = require('google-auth-library');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

dotenv.config();

// Database connection
mongoose.connect(process.env.DATABASE_ACCESS, () => {
  console.log('Database Connected');
});

// Serve Static assets If In Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'Client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API running');
  });
}

// Register new user
app.post('/signup', async (req, res) => {
  try {
    const newUser = new UserInfo({
      email: req.body.email,
      password: req.body.password,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login user
app.post('/login', async (req, res) => {
  try {
    const userEmail = await UserInfo.findOne({ email: req.body.email });
    const userPassword = await UserInfo.findOne({ password: req.body.password });

    if (!userEmail || !userPassword) {
      res.json('Wrong user or password');
    } else {
      const user = await UserInfo.findOne(userEmail);
      res.json({ response: 'valid', user });
    }
  } catch (error) {
    res.status(400).json('Error');
  }
});

// Save user information
app.post('/userInfo', async (req, res) => {
  try {
    const newUserIdentety = new UserIdentety({
      name: req.body.name,
      age: req.body.age,
      hobbies: req.body.hobbies,
    });

    const savedInfo = await newUserIdentety.save();
    res.json(savedInfo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all users
app.get('/allUsers', async (req, res) => {
  try {
    const users = await UserIdentety.find({});
    res.send(users);
  } catch (error) {
    res.status(400).json({ error: 'Internal Server Error' });
    console.log(`Error From Use Effect ${error}`);
  }
});

// Delete user information from database
app.delete('/remove/info/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const removedData = await UserIdentety.findByIdAndRemove(id);
    res.json(removedData);
  } catch (error) {
    res.json(error);
  }
});

// Delete user by email
app.delete('/delete/email/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const removedData = await UserInfo.findByIdAndRemove(id);
    res.json(removedData);
  } catch (error) {
    res.json(error);
  }
});

// Get user data by ID
app.get('/userData/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const userData = await UserIdentety.findById(id);

    if (userData) {
      res.send(userData);
    } else {
      res.send('User not found');
    }
  } catch (error) {
    console.log(`Error From Passing Data ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update user information
app.put('/update', async (req, res) => {
  try {
    const id = req.body.id;
    const newName = req.body.newName;
    const newAge = req.body.newAge;
    const newHobby = req.body.newHobby;

    const updatedUser = await UserIdentety.findById(id);

    if (updatedUser) {
      updatedUser.name = newName;
      updatedUser.age = newAge;
      updatedUser.hobbies = newHobby;
      await updatedUser.save();
      res.send(updatedUser);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.log(`Error From Update ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Google login
const Authenclient = new OAuth2Client(process.env.OAuth_Client_IDs);

app.post('/googlelogin', async (req, res) => {
  const tokenId = req.body.tokenId;

  try {
    const response = await Authenclient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.OAuth_Client_IDs,
    });

    const email_verified = response.payload.email_verified;
    const email = response.payload.email;
    const name = response.payload.name;

    if (email_verified) {
      const googleUser = await GoogleLogin.findOne({ email });

      if (googleUser) {
        res.json({ response: 'GoogleGood', googleUser });
      } else {
        const newGoogleClient = new GoogleLogin({
          tokenId,
          email,
          name,
        });

        const savedGoogleUser = await newGoogleClient.save();
        res.json(savedGoogleUser);
      }
    }
  } catch (error) {
    res.json(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
