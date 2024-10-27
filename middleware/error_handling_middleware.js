import ApiError from "../errors/api_error.js";
export default function (err, req, res, next) {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.status).send({ message: err.message });
  }
  if (err instanceof SyntaxError) {
    return res.status(err.status).send({ message: err.message });
  }
  return res.status(500).send({
    message: "Internal Server error",
  });
}
