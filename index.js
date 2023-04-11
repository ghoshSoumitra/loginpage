const express=require('express');
const app=express();
const port=8000;
const mongoose=require('mongoose');
const db= require('./config/mongoose')
const registerschema=require('./model/register')
const bodyParser = require('body-parser');
const User=require('./model/user')
const session = require('express-session');
const passport = require('passport');
app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const bcrypt = require('bcrypt');
app.get('/',(req,res)=>{
    res.render('home')
    
})
app.get('/register',(req,res)=>{
res.render('SignUp')
})

app.use(session({
  secret: 'My-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.post('/register', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    console.log(req.body)

    // Check if user already exists in database
    const user = await User.findOne({ email });
    if (user) {
      return res.send('User already exists. Please log in.');
    }

    // User is not already registered, so create a new user
    const newUser = new User({
      email,
      password,
      confirmPassword
    });

    await newUser.save();
    // res.send('User registered successfully!');
    console.log('User registered successfully!')
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

  

app.post('/login', async (req, res) => {
  

  try {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
   

    if (user) {
        console.log(user.password)
        console.log(req.body.password)
      const match =req.body.password===user.password;
    
      if (match) {
        // res.send(`Hello, ${user.email}!`);
        res.render('logOut',{
          email:user.email
        })
      } else if(!match) {
        res.send('Incorrect password.');
      }
    } else {
      res.send('User not found.');
    }
  } catch (e) {
    res.send('An error occurred.');
  }
});

  app.get('/logout', (req, res) => {
    
  req.logout(); // This will remove the user session data
 console.log('logged out successfully')
  res.redirect('/'); // Redirect the user to the home page or any other page of your choice
});

  

app.listen(port,()=>{
  console.log("server created successfully")
})
