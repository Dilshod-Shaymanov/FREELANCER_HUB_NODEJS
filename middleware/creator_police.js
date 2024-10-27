import { to } from "../helpers/to_promise.js";
import myJwt from "../services/admin_jwt_service.js";
export default async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
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
    req.admin = decodedToken;
    // console.log(decodedToken);
    if(!decodedToken.is_creator){
        return res.status(400).send({
            message:"Siz creator emassiz"
        })
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      error: "Error occured in admin police",
    });
  }
}
