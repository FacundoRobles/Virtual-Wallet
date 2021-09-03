const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mysql = require('mysql');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const { database } = require('./keys');

const myWalletRoutes = require('./routes/myWallet');
const userRoutes = require('./routes/users');

//EXPRESS INIT
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

//session
//sesion secret
const secret = process.env.SECRET || 'thiswillbeaseacret';
//session storage
const store = mysqlStore(database);

store.on('error', function(e){
    console.log('SESSION STORE ERROR', e)
});
//session config
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));

//FLASH
app.use(flash());
app.use((req, res, next) => {
    // if (!['/login', '/register', '/'].includes(req.originalUrl)){
    // 	req.session.returnTo = req.originalUrl;
    // }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//METHOD OVERRIDE
app.use(methodOverride('_method'));

//EJS TEMPLATES
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

//PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

//MIDDLEWARES
app.use(morgan('dev'));

//GLOBAL VARIABLES

//ROUTES
//MY WALLET ROUTE
app.use('/mywallet', myWalletRoutes);
//USER ROUTES
app.use('/', userRoutes);
//HOME ROUTE
app.get('/', (req, res) => {
    res.render('home');
});

//STARTING SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`serving on port ${port}`);
});
