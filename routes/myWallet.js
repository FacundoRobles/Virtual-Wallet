const express = require('express');
const router = express.Router();
const pool = require('../database');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const balance = require('../utils/balance');
const reverse = require('../utils/operationsReverse');
const catchAsync = require('../utils/catchAsync');
const { momentFunc, momentFromNow } = require('../utils/moment');
const { isLoggedIn, validateOperation } = require('../middlewares');
const categories = ['Expenses', 'Food', 'Groceries', 'Salary', 'Other'];

//INDEX CREATE AND READ OPERATIONS
router
    .route('/')
    .get(
        isLoggedIn,
        catchAsync(async (req, res) => {
            const { filter } = req.query;
            let query =
                'SELECT * FROM operations WHERE user_id = ' +
                pool.escape(req.user.id);
            if (filter && filter !== 'all')
                query = `SELECT * FROM operations WHERE user_id = ${pool.escape(
                    req.user.id
                )} AND category = ${pool.escape(filter)}`;

            const rawData = await pool.query(query);
            const operations = reverse(rawData);
            const balanceValue = balance(operations);
            let countOp = 0;
            let countBal = 0;

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
        isLoggedIn,
        validateOperation,
        catchAsync(async (req, res) => {
            const { operation } = req.body;
            operation.user_id = req.user.id;
            
            await pool.query('INSERT INTO operations set ?', [operation]);
            req.flash('success', 'Successfully created a new Operation.');
            res.redirect('/mywallet');
        })
    );

//NEW FORM
router.get('/new', isLoggedIn, (req, res) => {
    res.render('mywallet/new', { categories });
});

//UPDATE AND DELETE OPERATION
router
    .route('/:id')
    .get(
        isLoggedIn,
        catchAsync(async (req, res) => {
            const { id } = req.params;
            const rawData = await pool.query(
                'SELECT * FROM operations WHERE id = ?',
                [id]
            );
            const operation = rawData[0];
            res.render('mywallet/edit', { operation, categories });
        })
    )
    .put(
        isLoggedIn,
        validateOperation,
        catchAsync(async (req, res) => {
            const { id } = req.params;
            const { title, value, type, category, body } = req.body.operation;
            await pool.query(
                `UPDATE operations SET title='${pool.escape(
                    title
                )}', value=${pool.escape(value)}, type='${pool.escape(
                    type
                )}', category='${pool.escape(category)}', body='${pool.escape(
                    body
                )}' WHERE id =${pool.escape(id)}`
            );
            req.flash('success', 'Successfully updated Operation.');
            res.redirect('/mywallet');
        })
    )
    .delete(
        isLoggedIn,
        catchAsync(async (req, res) => {
            const { id } = req.params;
            await pool.query(`DELETE FROM operations WHERE id =${id}`);
            req.flash('success', 'Successfully deleted Operation');
            res.redirect('/mywallet');
        })
    );

module.exports = router;
