import { to } from "../helpers/to_promise.js";
import Admin from "../models/admin.js";
import myJwt from "../services/admin_jwt_service.js";
export default async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    // console.log(authorization);
    if (!authorization) {
      return res.status(403).send({
        error: "Token is not gave",
      });
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(403).send({
        error: "Incorrect token",
      });
    }
    const [error, decodedToken] = await to(myJwt.verifyAccessToken(token));
    if (error) {
      return res.status(403).send({ message: error.message });
    }
    const admin = await Admin.findByPk(decodedToken.id);
    if (!admin) {
      return res.status(403).send({
        error: "Admin topilmadi",
      });
    }
    req.admin = decodedToken;

    next();
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      error: "Error occured in admin police",
    });
  }
}
