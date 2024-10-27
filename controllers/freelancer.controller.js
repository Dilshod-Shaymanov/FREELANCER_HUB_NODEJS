import { errorHandler } from "../helpers/error_handler.js";
import bcrypt from "bcryptjs";
const { compareSync, hashSync } = bcrypt;
import Freelancer from "../models/freelancer.js";
import { v4 as uuidv4 } from "uuid";
import { freelancerValidations } from "../validations/freelancer_valitaion.js";
import myJwt from "../services/jwt_service.js";
import { setRefreshTokenCookie } from "../helpers/set_refrestoken_cookie.js";
import { to } from "../helpers/to_promise.js";
import mail_service from "../services/mail_service.js";
import config from "config";

class FreelancerController {
  async addFreelancer(req, res) {
    try {
      const { error, value } = freelancerValidations(req.body);
      if (error) {
        return res.status(400).send({
          error: error.message,
        });
      }

      const { first_name, last_name, email, password, skills, is_active } =
        value;
      const existingFreelancer = await Freelancer.findOne({
        where: { email: email },
      });

      if (existingFreelancer) {
        return res.status(400).send({ message: "Bunday freelancer mavjud!" });
      }

      const hashedPassword = hashSync(password, 7);
      const activation_link = uuidv4();

      const freelancer = await Freelancer.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        skills,
        is_active,
        activation_link: activation_link,
      });
      await mail_service.sendActivitionMail(
        email,
        `${config.get("api_url")}:${config.get(
          "port"
        )}/api/freelancer/activate/${activation_link}`
      );
      const payload = {
        id: freelancer.id,
        first_name,
        last_name,
        email,
      };
      const tokens = myJwt.generateTokens(payload);
      freelancer.token = tokens.refreshToken;
      await freelancer.save();
      setRefreshTokenCookie(res, tokens.refreshToken);

      res.send({
        message: "New freelancer added",
        Link:"Freelancer ni activalashtirish uchun emailigizga link yuborildi",
        freelancerId: freelancer.id,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getFreelancers(req, res) {
    try {
      const freelancers = await Freelancer.findAll({include:{all:true}});
      if (!freelancers) {
        return res.status(404).send({
          message: "Bitta ham freelancer topilmadi!",
        });
      }
      res.send(freelancers);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getFreelancerById(req, res) {
    try {
      const { id } = req.params;
      const freelancer = await Freelancer.findByPk(id);

      if (!freelancer) {
        return res.status(404).send({
          message: "Freelancer not found",
        });
      }

      res.send({
        message: "Freelancer fetched successfully",
        data: freelancer,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async deleteFreelancerById(req, res) {
    try {
      const { id } = req.params;
      const result = await Freelancer.destroy({
        where: { id: id },
      });

      if (result === 0) {
        return res.status(404).send({
          message: "Freelancer not found",
        });
      }

      res.send({
        message: "Freelancer deleted successfully",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async updateFreelancerById(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = freelancerValidations(req.body);
      if (error) {
        return res.status(400).send({ error: error.message });
      }

      const freelancer = await Freelancer.findByPk(id);
      if (!freelancer) {
        return res.status(404).send({
          message: "Freelancer not found",
        });
      }

      const updatedFreelancer = await Freelancer.update(
        { ...value },
        { where: { id: id }, returning: true }
      );

      res.send({
        message: "Freelancer updated successfully",
        data: updatedFreelancer[1][0],
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async freelancerLogin(req, res) {
    try {
      const { email, password } = req.body;
      const freelancer = await Freelancer.findOne({ where: { email } });
      if (!freelancer) {
        return res.status(400).send({
          message: "Email yoki password noto'g'ri!",
        });
      }
      const validPassword = compareSync(password, freelancer.password);
      if (!validPassword) {
        return res.status(400).send({
          message: "Email yoki password noto'g'ri!",
        });
      }
      const payload = {
        id: freelancer.id,
        email,
        name: freelancer.first_name,
        is_active: freelancer.is_active,
      };
      const tokens = myJwt.generateTokens(payload);
      freelancer.token = tokens.refreshToken;
      await freelancer.save();
      setRefreshTokenCookie(res, tokens.refreshToken);

      res.send({
        message: "Freelancer logged in successfully",
        id: freelancer.id,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async freelancerLogout(req, res) {
    try {
      const { refresh_token } = req.cookies;

      if (!refresh_token) {
        return res.status(403).send({
          message: "Cookie allaqachon tozalangan",
        });
      }
      const [affectedRows] = await Freelancer.update(
        { token: "" },
        { where: { token: refresh_token } }
      );
      if (affectedRows === 0) {
        return res.status(400).send({
          message: "Yaroqsiz refres token",
        });
      }
      res.clearCookie("refresh_token");
      res.send({
        message: "Freelancer successfully logged out",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async freelancerRefreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return res.status(403).send({
          message: "Refresh token topilmadi (Cookieda)",
        });
      }
      const [error, decodedRefreshToken] = await to(
        myJwt.verifyRefreshToken(refreshToken)
      );
      if (error) {
        return res.status(403).send({
          message: error.message,
        });
      }
      const freelancer = await Freelancer.findOne({
        where: { token: refreshToken },
      });
      if (!freelancer) {
        return res.status(403).send({
          message: "Ruxsat etilmagan foydalanuvchi (token mos emas)",
        });
      }
      const payload = {
        id: freelancer.id,
        email: freelancer.email,
        name: freelancer.first_name,
        is_active: freelancer.is_active,
      };
      const tokens = myJwt.generateTokens(payload);
      freelancer.token = tokens.refreshToken;
      await freelancer.save();
      setRefreshTokenCookie(res, tokens.refreshToken);
      res.send({
        message: "Freelancer Tokens refreshed successfully",
        id: freelancer.id,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async freelancerActivate(req, res) {
    try {
      const link = req.params.link;
      const freelancer = await Freelancer.findOne({
        where: { activation_link: link },
      });
      if (!freelancer) {
        return res.status(400).send({
          message: "Bunday Freelancer topilmadi",
        });
      }

      if (freelancer.is_active) {
        return res
          .status(400)
          .send({ message: "Bu Freelancer avval faollashtrilgan" });
      }
      freelancer.is_active = true;
      await freelancer.save();
      res.send({
        message: "Frelancer faollashtrildi",
        is_active: freelancer.is_active,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new FreelancerController();
