import logger from "../services/logger_serice.js";
const errorHandler = (error, res) => {
  console.log(error);
  logger.error(error);
  return res.status(500).send({ error: error.message });
};

export { errorHandler };
