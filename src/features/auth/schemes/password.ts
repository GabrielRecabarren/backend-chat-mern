import Joi,  { ObjectSchema} from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({});

const passwordSchema: ObjectSchema = Joi.object().keys({});

export { emailSchema, passwordSchema};
