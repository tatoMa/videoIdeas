const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

// load user model
require('../models/User')
const User = mongoose.model('users')

// routes
router.get('/login', (req, res) => {
  res.render('users/login')
})

router.get('/register', (req, res) => {
  res.render('users/register')
})

// login from POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

// logout User
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})

// register form post
router.post('/register', (req, res) => {
  let errors = []
  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' })
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'Passwords must longer than 4 chars' })
  }
  if (errors.length > 0) {
    // res.send(errors)
    res.render('users/register', {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
      errors: errors
    })
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash('error_msg', 'Email already registered')
        res.redirect('/users/register')
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'you are registered!')
                console.log(user)
                res.redirect('/users/login')
              })
              .catch(err => {
                console.log(err)
                return
              })
          })
        })
      }
    })
  }
})
module.exports = router
