// app.js

// require modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override")
const eventRoutes = require('./routes/eventRouts');
const mainRoutes = require('./routes/mainRouts.js');
const userRoutes = require('./routes/userRoutes');
const rsvpRoutes = require('./routes/rsvpRouts');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const store = require("connect-mongo");
// Import mainRoutes
const mongoose = require('mongoose')
const path = require('path');
//Creating app
const app = express(); 

// configure app
let port = 3500; 
let host = "localhost"
let url = 'mongodb+srv://ajmalamir:f0CsOYCw56Bc1xs7@project3-cluster.ciycsq7.mongodb.net/ndba-project3?retryWrites=true&w=majority&appName=project3-cluster';
app.set('view engine', 'ejs')

// Connecting to Mongoose
mongoose.connect(url) 
.then (() =>{
    app.listen(port, host, () => {
        console.log("Server is running on port: ", port);
    });
    
})
.catch(err => console.log(err.message));


// mounting middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny')); 

app.use(methodOverride('_method'));

// Session middleware
app.use(session({
    secret: '$2b$10$A7IZQe1DTI3I1Wzew3PKueKp',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb+srv://ajmalamir:f0CsOYCw56Bc1xs7@project3-cluster.ciycsq7.mongodb.net/ndba-project3?retryWrites=true&w=majority&appName=project3-cluster'}) 
}));

// Flash messages middleware
app.use(flash());

app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// Set up routes
app.get('/', (req, res) => {
    res.render('index'); 
}); 

// Use mainRoutes for /about, /contact, and /home (index)
app.use('/',mainRoutes);

app.use('/events', eventRoutes); // Use eventRoutes for /events
app.use('/user', userRoutes);



app.use('/', rsvpRoutes);

app.use((req, res, next) =>{
    let err = new Error('The server connot locate ' + req.url); 
    err.status = 404; 
    next(err); 
})


app.use(express.static(path.join(__dirname, 'public')));

// Error handler middleware
app.use((err, req, res, next) => {
    // Set the status code
    res.status(err.status || 500);
    // Render the error page
    res.render('error', {
        error: err
    });
});
