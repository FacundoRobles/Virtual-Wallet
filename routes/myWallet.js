const express = require('express');
const router = express.Router();
const pool = require('../database');

const balance = require('../utils/balance');
const reverse = require('../utils/operationsReverse');
const catchAsync = require('../utils/catchAsync');
const { momentFunc, momentFromNow } = require('../utils/moment');

const categories = ['Expenses', 'Food', 'Groceries', 'Salary', 'Other'];
//INDEX CREATE AND READ OPERATIONS
router
    .route('/')
    .get(
        catchAsync(async (req, res) => {
            const {filter} = req.query
            let query='SELECT * FROM operations'
            if(filter && filter !== 'all') query =`SELECT * FROM operations WHERE category ='${filter}'`
            const rawData = await pool.query(query);
            const operations = reverse(rawData);
            const balanceValue = balance(operations);
            let countOp = 0
            let countBal = 0
            
            res.render('mywallet/index', {
                countOp,
                countBal,
                categories,
                filter,
                operations,
                balanceValue,
                momentFunc,
                momentFromNow,
            });
        })
    )
    .post(
        catchAsync(async (req, res) => {
            const { operation } = req.body;
            console.log(operation);
            await pool.query('INSERT INTO operations set ?', [operation]);
            res.redirect('/mywallet');
        })
    );

//NEW FORM

router.get('/new', (req, res) => {
    res.render('mywallet/new', { categories });
});

//FILTER
router.get('/filter',catchAsync(async (req,res)=>{
    const { filter } = req.query
    const rawData = await pool.query(`SELECT * FROM operations WHERE category ='${filter}'`);
    const operations = reverse(rawData);
    const balanceValue = balance(operations);
    res.render('mywallet/index', {operations,
    balanceValue,
    momentFunc,
    momentFromNow,
    })
}));

//UPDATE AND DELETE OPERATION
router
    .route('/:id')
    .get(
        catchAsync(async (req, res) => {
            const { id } = req.params;
            const rawData = await pool.query(
                `SELECT * FROM operations WHERE id =${id}`
            );
            const operation = rawData[0];
            console.log(operation);
            res.render('mywallet/edit', { operation, categories });
        })
    )
    .put(
        catchAsync(async (req, res) => {
            const { id } = req.params;
            const { title, value, type, category, body } = req.body.operation;
            await pool.query(
                `UPDATE operations SET title='${title}', value=${value}, type='${type}', category='${category}', body='${body}' WHERE id =${id}`
            );
            res.redirect('/mywallet');
        })
    )
    .delete(
        catchAsync(async (req, res) => {
            const { id } = req.params;
            await pool.query(`DELETE FROM operations WHERE id =${id}`);
            res.redirect('/mywallet');
        })
    );

module.exports = router;
