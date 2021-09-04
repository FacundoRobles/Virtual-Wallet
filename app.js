if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
};

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
const passport = require('passport');
// const helmet = require('helmet')


const myWalletRoutes = require('./routes/myWallet');
const userRoutes = require('./routes/users');
const ExpressError = require('./utils/ExpressError');
const passportConfig = require('./utils/passport');

//EXPRESS INIT
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

//session
//sesion secret
const secret = process.env.SECRET || 'thiswillbeaseacret';
//session storage
const store = mysqlStore(database);

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e);
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

//PASSPORT

app.use(passport.initialize());
app.use(passport.session());

//FLASH
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//NO RETURN TO MIDDLEWARE
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    next();
});
//METHOD OVERRIDE
app.use(methodOverride('_method'));

//EJS TEMPLATES
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

//PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

//MORGAN
app.use(morgan('dev'));

//ROUTES
//MY WALLET ROUTE
app.use('/mywallet', myWalletRoutes);
//USER ROUTES
app.use('/', userRoutes);
//HOME ROUTE
app.get('/', (req, res) => {
    res.render('home');
});

//helmet

// app.use(helmet());
// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// 	"https://cdn.jsdelivr.net",
// ];
// const connectSrcUrls = [
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );


// error route handlers
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    if (!err.message) err.message = 'Something Went Wrong.';
    res.status((err.statusCode = 500)).render('error', { err });
});

//STARTING SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`serving on port ${port}`);
});
