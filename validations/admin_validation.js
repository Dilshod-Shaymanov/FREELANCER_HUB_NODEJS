import Joi from "joi";

const adminValidations = (data) => {
  const adminModel = Joi.object({
    name: Joi.string().max(30).min(6).trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().alphanum().max(16).min(6).trim(),
    is_creator: Joi.boolean().default(false),
    is_active: Joi.boolean().default(false),
    token: Joi.string(),
  });
  return adminModel.validate(data, { abortEarly: false });
};

export { adminValidations };
