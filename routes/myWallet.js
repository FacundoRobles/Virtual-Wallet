const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateOperation } = require('../middlewares');
const myWallet = require('../controllers/myWallet');
//INDEX CREATE AND READ OPERATIONS
router
    .route('/')
    .get(isLoggedIn, catchAsync(myWallet.index))
    .post(isLoggedIn, validateOperation, catchAsync(myWallet.createOperation));

//NEW FORM
router.get('/new', isLoggedIn, myWallet.renderNewForm);

//UPDATE AND DELETE OPERATION
router
    .route('/:id')
    .get(isLoggedIn, catchAsync(myWallet.renderEditForm))

    .put(isLoggedIn, validateOperation, catchAsync(myWallet.updateOperation))
    .delete(isLoggedIn, catchAsync(myWallet.deleteOperation));

module.exports = router;
