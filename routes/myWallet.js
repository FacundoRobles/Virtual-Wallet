const express = require('express');
const router = express.Router();
const pool = require('../database');
const catchAsync = require('../utils/catchAsync');

const categories = ['Income', 'Outcome'];
//INDEX CREATE AND READ OPERATIONS
router.route('/')
    .get(catchAsync(async (req, res) => {
        const operations = await pool.query('SELECT * FROM operations');
        res.render('mywallet/index', { operations });
    }))
    .post(catchAsync(async (req, res) => {
        const { operation } = req.body;
        console.log(operation);
        await pool.query('INSERT INTO operations set ?', [operation]);
        res.redirect('/mywallet/index');
    }));

//NEW FORM

router.get('/new', (req, res) => {
    res.render('mywallet/new');
});

//UPDATE AND DELETE OPERATION
router.route('/:id')
    .get(catchAsync(async (req, res) => {
        const { id } = req.params;
        const rawData = await pool.query(
            `SELECT * FROM operations WHERE id =${id}`
        );
        const operation = rawData[0];
        console.log(operation);
        res.render('mywallet/edit', { operation, categories });
    }))
    .put(catchAsync(async (req, res) => {
        const { id } = req.params;
        const { title, value, category, body } = req.body.operation;
        await pool.query(
            `UPDATE operations SET title='${title}', value=${value}, category='${category}', body='${body}' WHERE id =${id}`
        );
        res.redirect('/mywallet');
    }))
    .delete(catchAsync(async (req, res) => {
        const { id } = req.params;
        await pool.query(`DELETE FROM operations WHERE id =${id}`)
        res.redirect('/mywallet');
    }));

module.exports = router;
