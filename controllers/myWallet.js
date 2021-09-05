const { pool } = require('../database');
const { momentFunc} = require('../utils/moment');

const balance = require('../utils/balance');
const reverse = require('../utils/operationsReverse');

const categories = ['Expenses', 'Food', 'Groceries', 'Salary', 'Other'];

module.exports.index =async (req, res) => {
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
    });
};

module.exports.renderNewForm =  (req, res) => {
    res.render('mywallet/new', { categories });
}

module.exports.createOperation = async (req, res) => {
    const { operation } = req.body;
    operation.user_id = req.user.id;
    
    await pool.query('INSERT INTO operations set ?', [operation]);
    req.flash('success', 'Successfully created a new Operation.');
    res.redirect('/mywallet');
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const rawData = await pool.query(
        'SELECT * FROM operations WHERE id = ?',
        [id]
    );
    const operation = rawData[0];
    res.render('mywallet/edit', { operation, categories });
};

module.exports.updateOperation = async (req, res) => {
    const { id } = req.params;
    const { title, value, type, category, body } = req.body.operation;
    await pool.query('UPDATE operations SET title = ?, value = ?, type = ?, category = ?, body = ? WHERE id = ?', [title, value, type, category, body, id]);
    req.flash('success', 'Successfully updated Operation.');
    res.redirect('/mywallet');
};

module.exports.deleteOperation = async (req, res) => {
    const { id } = req.params;
    await pool.query(`DELETE FROM operations WHERE id =${id}`);
    req.flash('success', 'Successfully deleted Operation');
    res.redirect('/mywallet');
};