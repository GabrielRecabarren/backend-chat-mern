import Joi,  { ObjectSchema} from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
    email: Joi.string().email().required().messages({
        'string.base': 'Field must be a string',
        'string.required': 'Email is a required field',
        'string.email': 'Email must be valid'
    }),
});

const passwordSchema: ObjectSchema = Joi.object().keys({
    password: Joi.string().required().min(4).max(8).messages({
        'string.base': 'Password must be a string',
        'string.min': 'Invalid Password',
        'string.max': 'Invalid Password',
        'string.empty': 'Password is a required field'
    }),

    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({

        'any.only': 'Password should match',//si sólo si tiene el mismo valor
        'any.required': 'Confirm password is a required field'

    })
});

export { emailSchema, passwordSchema};
