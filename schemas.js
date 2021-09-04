const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) =>({
    type:'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label} must not include HTML!'
    },
    rules:{
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    },
});

const Joi = BaseJoi.extend(extension);

module.exports.operationSchema = Joi.object({
    operation: Joi.object({
        title: Joi.string().required().escapeHTML(),
        value: Joi.number().required().min(0),
        description: Joi.string().escapeHTML(),
    }).required(),
});

module.exports.signUpSchema = Joi.object({
        username: Joi.string().required().escapeHTML(),
        password: Joi.string().required().escapeHTML(),
        firstname: Joi.string().required().escapeHTML(),
        lastname: Joi.string().required().escapeHTML(),
    }).required();

module.exports.loginSchema = Joi.object({
        username: Joi.string().required().escapeHTML(),
        password: Joi.string().required().escapeHTML(),
    }).required();