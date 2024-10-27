import Joi from "joi";

const contractValidations = (data) => {
  const contractModel = Joi.object({
    projectId: Joi.number().integer().required(),
    freelancerId: Joi.number().integer().required(),
    status: Joi.string()
      .valid("pending", "in_progress", "completed", "canceled")
      .required(),
    contract_date: Joi.date().required(),
  });

  return contractModel.validate(data, { abortEarly: false });
};

export { contractValidations };
