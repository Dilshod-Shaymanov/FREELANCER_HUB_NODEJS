import Joi from "joi";

const clientValidations = (data) => {
  const clientModel = Joi.object({
    first_name: Joi.string().max(30).min(3).trim().required(),
    last_name: Joi.string().max(30).min(3).trim().required(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().alphanum().max(16).min(6).trim().required(),
    is_active: Joi.boolean().default(false),
    activation_link: Joi.string(),
    token: Joi.string(),
  });

  return clientModel.validate(data, { abortEarly: false });
};

export { clientValidations };
