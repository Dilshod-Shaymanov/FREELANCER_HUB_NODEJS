import Joi from "joi";

const paymentValidations = (data) => {
  const paymentModel = Joi.object({
    amount: Joi.number().precision(2).positive(),
    contractId: Joi.number().integer(),
    payment_type: Joi.string()
      .valid("credit_card", "debit_card", "cash", "bank_transfer")
      .required(),
    date: Joi.date().required(),
  });

  return paymentModel.validate(data, { abortEarly: false });
};

export { paymentValidations };
