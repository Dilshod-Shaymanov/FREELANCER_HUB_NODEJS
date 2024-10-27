import { errorHandler } from "../helpers/error_handler.js";
import Admin from "../models/admin.js";
import { adminValidations } from "../validations/admin_validation.js";
import bcrypt from "bcryptjs";
import myJwt from "../services/admin_jwt_service.js";
import { adminSetRefreshTokenCookie } from "../helpers/admin_set_refrestoken_cookie.js";
import { to } from "../helpers/to_promise.js";
import mail_service from "../services/mail_service.js";
import { generateOtp } from "../helpers/otp_generator.js";
import NodeCache from "node-cache";
const my_cashe = new NodeCache();

const { hashSync, compareSync } = bcrypt;

class AdminController {
  async addAdmin(req, res) {
    try {
      const { error, value } = adminValidations(req.body);
      if (error) {
        return res.status(400).send({
          error: error.message,
        });
      }
      const { name, email, password, is_creator, is_active } = value;
      const oldAdmin = await Admin.findOne({ where: { email: email } });

      if (oldAdmin) {
        return res.status(400).send({ message: "Bunday admin mavjud!" });
      }

      const hashed_password = hashSync(password, 7);
      const admin = await Admin.create({
        name,
        email,
        password: hashed_password,
        is_creator,
        is_active,
      });

      const payload = {
        name,
        id: admin.id,
        is_active,
        is_creator,
      };

      const tokens = myJwt.generateTokens(payload);
      admin.token = tokens.adminRefreshToken;
      await admin.save();

      adminSetRefreshTokenCookie(res, tokens.adminRefreshToken);

      res.send({
        message: "New admin added",
        adminId: admin.id,
        adminAccessToken: tokens.adminAccessToken,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async getAdmins(req, res) {
    try {
      const admins = await Admin.findAll();
      // console.log(admins);
      if (!admins) {
        return res.status(404).send({
          message: "Bitta ham admin topilmadi!",
        });
      }
      res.send(admins);
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async getAdminById(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admin.findByPk(id);

      if (id != req.admin.id) {
        return res.status(403).send({
          message: "Ruxsat etilmagan foydalanuvchi",
        });
      }
      if (!admin) {
        return res.status(404).send({
          message: "Admin not found",
        });
      } else {
        return res.send({
          message: "Admin fetched successfully",
          data: admin,
        });
      }
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async adminDeleteById(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admin.destroy({
        where: { id: id },
      });
      if (!admin) {
        return res.status(404).send({
          message: "Admin not found",
        });
      }
      res.send({
        message: "Admin deleted successfully",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async adminUpdateById(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = adminValidations(req.body);
      if (error) {
        return res.status(400).send({ error: error.message });
      }
      const admin = await Admin.findByPk(id);

      if (!admin) {
        return res.status(404).send({
          message: "Admin not found",
        });
      }
      const updatedAdmin = await Admin.update(
        { ...value },
        { where: { id: id }, returning: true }
      );
      res.send({
        message: "Admin updated successfully",
        data: updatedAdmin[1][0],
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        return res.status(400).send({
          message: "Email yoki password noto'g'ri!",
        });
      }
      const validPassword = compareSync(password, admin.password);
      if (!validPassword) {
        return res.status(400).send({
          message: "Email yoki password noto'g'ri!",
        });
      }
      const payload = {
        id: admin.id,
        email,
        name: admin.name,
        is_creator: admin.is_creator,
      };
      const tokens = myJwt.generateTokens(payload);
      admin.token = tokens.adminRefreshToken;
      await admin.save();
      adminSetRefreshTokenCookie(res, tokens.adminRefreshToken);

      res.send({
        message: "Admin logged in successfully",
        id: admin.id,
        adminAccessToken: tokens.adminAccessToken,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async adminRefreshToken(req, res) {
    try {
      const refreshToken = req.cookies.admin_refresh_token;
      if (!refreshToken) {
        return res.status(403).send({
          message: "Refresh token topilmadi Cookieda!",
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
      const admin = await Admin.findOne({ where: { token: refreshToken } });

      if (!admin) {
        return res.status(403).send({
          message: "Ruxsat etilmagan foydalanuvchi (token mos emas)",
        });
      }
      const payload = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        is_creator: admin.is_creator,
      };
      const tokens = myJwt.generateTokens(payload);
      admin.token = tokens.adminRefreshToken;
      admin.save();
      adminSetRefreshTokenCookie(res, tokens.adminRefreshToken);

      res.send({
        message: "Admin Token refreshed successfully",
        id: admin.id,
        accessToken: tokens.adminAccessToken,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async logoutAdmin(req, res) {
    try {
      const refreshToken = req.cookies.admin_refresh_token;

      if (!refreshToken) {
        return res.status(403).send({
          message: "Cookie allaqachon tozalangan",
        });
      }
      const [affectedRows] = await Admin.update(
        { token: "" },
        { where: { token: refreshToken } }
      );

      if (affectedRows === 0) {
        return res.status(400).send({
          message: "Yaroqsiz refres token",
        });
      }
      res.clearCookie("admin_refresh_token");
      res.send({
        message: "Admin successfully logged out",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).send({
          message: "Email manzil kiritilmadi",
        });
      }

      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        return res.status(404).send({
          message: "Bunday admin topilmadi",
        });
      }

      const otp = generateOtp();
      // console.log(otp);
      await mail_service.sendLinkToEmail(email, otp);
      my_cashe.set(otp, email, 1200);

      res.send({
        message: "Emailingizga parolni tiklash kodi yuborildi!",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async resetPassword(req, res) {
    try {
      const { code, new_password, confirm_password } = req.body;
      if (!code || !new_password || !confirm_password) {
        return res.status(400).send({
          message: "Kod va yangi parolni kiriting.",
        });
      }

      const cachedEmail = my_cashe.get(code); 
      if (!cachedEmail) {
        return res.status(400).send({
          message: "Kod noto'g'ri yoki muddati o'tgan.",
        });
      }

      const admin = await Admin.findOne({
        where: { email: cachedEmail },
      });
      if (!admin) {
        return res.status(404).send({
          message: "Admin topilmadi.",
        });
      }

      // console.log(cachedEmail,code);
      admin.password = hashSync(new_password, 7);
      await admin.save();
      my_cashe.del(code); 

      res.send({
        message: "Parol muvaffaqiyatli yangilandi.",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new AdminController();
