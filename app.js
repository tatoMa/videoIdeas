const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

// set routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// passport config
require('./config/passport')(passport)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// static public folder
app.use(express.static(path.join(__dirname, 'public')))

// method override middleware
app.use(methodOverride('_method'))

// express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// DB config
const db = require('./config/database')

// mongoose.Promise = global.Promise
// connect to mongoose
mongoose
  .connect(
    db.mongoURI,
    { useNewUrlParser: true }
    // {
    //   useMongoClient: true
    // }
  )
  .then(() => console.log('Mongodb is connected'))
  .catch(err => console.log(err))

// Routers
app.get('/', (req, res) => {
  const title = 'welcome'
  res.render('index', { title })
})

app.get('/about', (req, res) => {
  res.render('about')
})

// use routes
app.use('/ideas', ideas)
app.use('/users', users)

// Server start
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`server started on port ${port}`)
})
