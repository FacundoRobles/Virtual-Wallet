const express= require('express');
const router = express.Router();
const pool = require('../database');

//INDEX
router.get('/', (req, res) => {
    res.render('mywallet/index');
});

//NEW
router.get('/new', (req,res)=>{
    res.render('mywallet/new');
})


module.exports = router;