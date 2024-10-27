import Joi from "joi";

const projectValidations = (data) => {
  const projectModel = Joi.object({
    clientId: Joi.number().integer(),
    freelancerId: Joi.number().integer(),
    title: Joi.string().max(255).required(),
    description: Joi.string().max(1000),
    budget: Joi.string().max(20),
    status: Joi.string()
      .valid("pending", "in_progress", "completed", "canceled")
      .required(),
    start_date: Joi.date(),
    end_date: Joi.date().greater(Joi.ref("start_date")),
  });

  return projectModel.validate(data, { abortEarly: false });
};

export { projectValidations };
