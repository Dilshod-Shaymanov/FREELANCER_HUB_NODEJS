import Joi from "joi";

const freelancerValidations = (data) => {
  const freelancerSchema = Joi.object({
    first_name: Joi.string().max(30).min(2).trim().required(),
    last_name: Joi.string().max(30).min(2).trim().required(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().alphanum().min(6).max(16).required().trim(),
    skills: Joi.array().items(Joi.string()).optional(),
    is_active: Joi.boolean().default(false),
    token: Joi.string(),
    activation_link: Joi.string(),
  });

  return freelancerSchema.validate(data, { abortEarly: false });
};

export { freelancerValidations };
