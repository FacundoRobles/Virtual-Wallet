const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mysql = require('mysql');
const morgan = require('morgan');
const methodOverride = require('method-override');

const myWalletRoutes = require('./routes/myWallet');
const userRoutes = require('./routes/users');

//EXPRESS INIT
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

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
