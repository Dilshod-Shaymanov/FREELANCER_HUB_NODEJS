import Joi from "joi";

const reviewValidations = (data) => {
  const reviewModel = Joi.object({
    clientId: Joi.number().integer(),
    freelancerId: Joi.number().integer(),
    projectId: Joi.number().integer(),
    raiting: Joi.string().max(5),
    comment: Joi.string().max(255).trim(),
    date: Joi.date().required(),
  });

  return reviewModel.validate(data, { abortEarly: false });
};

export { reviewValidations };
