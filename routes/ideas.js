const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { ensureAuthenticated } = require('../helpers/auth')

// load idea model
require('../models/Idea')
const Idea = mongoose.model('ideas')

// routes
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', { ideas })
    })
    .catch(err => {
      console.log(err)
      return
    })
})

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add')
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash(
          'error_msg',
          "Not Autorised. Can't edit the idea not belong to you"
        )
        res.redirect('/ideas')
      } else {
        res.render('ideas/edit', {
          idea: idea
        })
      }
    })
    .catch(err => {
      console.log(err)
      return
    })
})

// process form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = []
  if (!req.body.title) {
    errors.push({ text: 'Please add a title' })
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add details' })
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newIdea).save().then(idea => {
      req.flash('success_msg', 'Video idea added')
      res.redirect('/ideas')
    })
  }
})

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      idea.title = req.body.title
      idea.details = req.body.details
      idea.save().then(idea => {
        req.flash('success_msg', 'Video idea updated')
        res.redirect('/ideas')
      })
    })
    .catch(err => {
      console.log(err)
      return
    })
})

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
    .then(() => {
      req.flash('success_msg', 'Video idea removed')
      res.redirect('/ideas')
    })
    .catch(err => {
      console.log(err)
      return
    })
})

module.exports = router
