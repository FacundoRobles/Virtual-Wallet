const express= require('express');
const router = express.Router();
const pool = require('../database');

//INDEX
router.get('/login',(req,res)=>{
    res.render('users/login')
})

module.exports = router;