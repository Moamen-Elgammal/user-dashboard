const express = require('express');
const router = express.Router();

const { OAuth2Client } = require('google-auth-library');
const userSchema = require('../models/UserInfo');
const infoSchema = require('../models/Identefier');
const googleSchema = require('../models/GoogleLogin');

// THESE FOR USERS ROUTES HANDLING:-
//*************************************

// IN (( RegisterForm )) :-

// Using Google For (( login + SignUp ))
const Authenclient = new OAuth2Client(
  '773069387302-d5cih0oc4n17tn3lq9d412dm6tokh8sb.apps.googleusercontent.com'
);

router.post('/googlelogin', (req, res) => {
  // BECAUSE YOU LOGIN HERE WITH GOOGLE YOU MUST BE GO DIRECTLY TO ALL USERS PAGE
  // THE VERFIYING HERE IS THE COMPAIRING OF THE TOKES IF ITS EXISTS THEN DONT MAKE A NEW ONE ELSE MAKE A NEW ONE TO DATA BASE;
  // WE MAKING THE VERTIFY WITH 3RD PARTY LIBRERY THAT GIVE ACCESS TO THE TOKENS

  // IF I'M OLD USER AND THEN: THE TOKEN AFTER COMPAIRING IS EXISTING
  // iF I'M NEW USER THEN: THE TOKEN AFTER COMPAIRING FOUND NOTHING:

  // MAKING THE VALIDATION FROM GOOGLE-AUTH-LIBRARY 3RD PARTY LIBRARY

  const tokenId = req.body.tokenId;

  Authenclient.verifyIdToken({
    idToken: tokenId,
    audience:
      '773069387302-d5cih0oc4n17tn3lq9d412dm6tokh8sb.apps.googleusercontent.com',
  }).then((response) => {
    const email_verified = response.payload.email_verified;
    const email = response.payload.email;
    const name = response.payload.name;

    if (email_verified) {
      googleSchema.findOne({ email }).exec((err, googleUser) => {
        if (googleUser) {
          res.json({ response: 'GoogleGood', googleUser: googleUser });
        } else {
          const newGoogleClient = new googleSchema({
            tokenId: tokenId,
            email: email,
            name: name,
          });
          newGoogleClient
            .save()
            .then((data) => {
              res.json(data);
            })
            .catch((err) => {
              res.json(err);
            });
        }
      });
    }
  });
});

// POST THE NEW USER E-MAIL & PASSWORD TO THE SCHEMA
router.post('/signup', (request, response) => {
  const newUser = new userSchema({
    email: request.body.email,
    password: request.body.password,
  });
  newUser
    .save()
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      response.json(error);
    });
});

// VERTIFYING USER E-MAIL & PASSWORD TO MAKE SURE THAT THE IS EXIST
router.post('/login', async (request, response) => {
  const userEmail = await userSchema.findOne({
    email: request.body.email,
  });

  const userPassword = await userSchema.findOne({
    password: request.body.password,
  });

  try {
    if (!userEmail || !userPassword) {
      response.json('wrong user Or Password');
    } else {
      const user = await userSchema.findOne(userEmail);
      response.json({ response: 'valid', user: user });
    }
  } catch {
    response.status(400).json('error');
  }
});

// *********************************************************************************************************************************************************//
// THESE FOR INFO ROUTES HANDLING:-
//***********************************

// IN (( UserInfo COMPONENT ))

// POST REQUEST TO THE ANSWERS FOR INDINTEFIER THE USER --TELL US MORE ABOUT YOUR SELF--
router.post('/info/userInfo', (req, res) => {
  const newUserIdentety = new infoSchema({
    name: req.body.name,
    age: req.body.age,
    hobbies: req.body.hobbies,
  });
  newUserIdentety
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
});

//  IN (( USERS COMPONENT )) :-

//  useEffect() HOOK TO GET ALL USERS :
router.get('/info/allUsers', (req, res) => {
  infoSchema.find({}, (err, result) => {
    try {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    } catch (err) {
      res.status(400).json('error');
      console.log(`Error From Use Effect ${err}`);
    }
  });
});

// DELETE THE USER INFO FROM DATA BASE :
router.delete('/info/delete/:id', async (req, res) => {
  const id = req.params.id;

  await infoSchema
    .findByIdAndRemove(id)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => res.json(error));
});

//  IN (( UsersTable COMPONENT )):

// GET THE OLD USER DATA AND PASS IT TO UPDATE USER COMPONENT TO SHOW IT IN THE UPDATE FORM
router.get('/info/oldData/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const userData = await infoSchema.findById(id);
    if (userData) {
      res.send(userData);
    } else {
      res.send(error);
    }
    // res.send(result);
  } catch (error) {
    console.log(`Thats Error From Passing Data ${error}`);
  }
});

// IN (( UpdateUser COMPONENT )):

// PUT REQUEST THE NEW UPDATED-USER INFO
router.put('/info/update', async (req, res) => {
  const newName = req.body.newName;
  const newAge = req.body.newAge;
  const newHobby = req.body.newHobby;
  const id = req.body.id;

  try {
    const updatedUser = await infoSchema.findById(id);
    if (updatedUser) {
      updatedUser.name = newName;
      updatedUser.age = newAge;
      updatedUser.hobbies = newHobby;
      updatedUser.save().then(res.send(updatedUser));
    } else {
      res.send(error);
    }
  } catch (error) {
    console.log(`Thats Error From Update 2 ${error}`);
  }
});

module.exports = router;
