const ExpressError = require('./utils/ExpressError');

const { operationSchema, signUpSchema, loginSchema } = require('./schemas');

module.exports.validateOperation = async (req, res, next) => {
	try {
		if(!req.body.operation.body)
        	req.body.operation.body = 'Description';
		const value = await operationSchema.validateAsync(req.body);
	}
	catch (error) { 
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
	next();
};

module.exports.validateSignUp = (req, res, next) => {
	const { error } = signUpSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
module.exports.validateLogin = (req, res, next) => {
	const { error } = loginSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in')
        return res.redirect('/error')
    }
    next();
}