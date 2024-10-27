import { errorHandler } from "../helpers/error_handler.js";
import bcrypt from "bcryptjs";
import myJwt from "../services/jwt_service.js";
import { setRefreshTokenCookie } from "../helpers/set_refrestoken_cookie.js";
const { hashSync, compareSync } = bcrypt;
import { v4 as uuidv4 } from "uuid";
import { clientValidations } from "../validations/client_valitaion.js";
import Client from "../models/clients.js";
import { to } from "../helpers/to_promise.js";
import mail_service from "../services/mail_service.js";
import config from "config";

class ClientController {
  async addClient(req, res) {
    try {
      const { error, value } = clientValidations(req.body);
      if (error) {
        return res.status(400).send({
          error: error.message,
        });
      }
      const { first_name, last_name, email, password, is_active } = value;
      const oldClient = await Client.findOne({ where: { email: email } });

      if (oldClient) {
        return res.status(400).send({ message: "Bunday client mavjud!" });
      }

      const hashed_password = hashSync(password, 7);
      const activation_link = uuidv4();

      const client = await Client.create({
        first_name,
        last_name,
        email,
        password: hashed_password,
        is_active,
        activation_link,
      });
      await mail_service.sendActivitionMail(
        email,
        `${config.get("api_url")}:${config.get(
          "port"
        )}/api/client/activate/${activation_link}`
      );

      const payload = {
        first_name,
        last_name,
        id: client.id,
        is_active,
      };

      const tokens = myJwt.generateTokens(payload);
      client.token = tokens.refreshToken;
      await client.save();

      setRefreshTokenCookie(res, tokens.refreshToken);

      res.send({
        message: "New client added",
        Link: "Clientni activlashtrish uchun emailingizga Link yuborildi!",
        clientId: client.id,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getClients(req, res) {
    try {
      const clients = await Client.findAll({ include: { all: true } });
      if (!clients) {
        return res.status(404).send({
          message: "Bitta ham client topilmadi!",
        });
      }
      res.send(clients);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getClientById(req, res) {
    try {
      const { id } = req.params;
      const client = await Client.findByPk(id);

      if (id != req.client.id) {
        return res.status(403).send({
          message: "Ruxsat etilmagan foydalanuvchi",
        });
      }
      if (!client) {
        return res.status(404).send({
          message: "Client not found",
        });
      } else {
        return res.send({
          message: "Client fetched successfully",
          data: client,
        });
      }
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async clientDeleteById(req, res) {
    try {
      const { id } = req.params;
      const client = await Client.destroy({
        where: { id: id },
      });
      if (!client) {
        return res.status(404).send({
          message: "Client not found",
        });
      }
      res.send({
        message: "Client deleted successfully",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async clientUpdateById(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = clientValidations(req.body);
      if (error) {
        return res.status(400).send({ error: error.message });
      }
      const client = await Client.findByPk(id);

      if (!client) {
        return res.status(404).send({
          message: "Client not found",
        });
      }
      const updatedClient = await Client.update(
        { ...value },
        { where: { id: id }, returning: true }
      );
      res.send({
        message: "Client updated successfully",
        data: updatedClient[1][0],
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async clientLogin(req, res) {
    try {
      const { email, password } = req.body;
      const client = await Client.findOne({ where: { email } });
      if (!client) {
        return res.status(400).send({
          message: "Email yoki password noto'g'ri!",
        });
      }
      const validPassword = compareSync(password, client.password);
      if (!validPassword) {
        return res.status(400).send({
          message: "Email yoki password noto'g'ri!",
        });
      }
      const payload = {
        id: client.id,
        email,
        name: client.first_name,
        is_active: client.is_active,
      };
      const tokens = myJwt.generateTokens(payload);
      client.token = tokens.refreshToken;
      await client.save();
      setRefreshTokenCookie(res, tokens.refreshToken);

      res.send({
        message: "Client logged in successfully",
        id: client.id,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async clientLogout(req, res) {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return res.status(403).send({
          message: "Cookie allaqachon tozalangan",
        });
      }
      const [affectedRows] = await Client.update(
        { token: "" },
        { where: { token: refreshToken } }
      );
      if (affectedRows === 0) {
        return res.status(400).send({
          message: "Yaroqsiz refres token",
        });
      }
      res.clearCookie("refresh_token");
      res.send({
        message: "Client successfully logged out",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async clientRefreshToken(req, res) {
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
      const client = await Client.findOne({ where: { token: refreshToken } });
      if (!client) {
        return res.status(403).send({
          message: "Ruxsat etilmagan foydalanuvchi (token mos emas)",
        });
      }
      const payload = {
        id: client.id,
        email: client.email,
        name: client.first_name,
        is_active: client.is_active,
      };
      const tokens = myJwt.generateTokens(payload);
      client.token = tokens.refreshToken;
      await client.save();
      setRefreshTokenCookie(res, tokens.refreshToken);
      res.send({
        message: "Tokens refreshed successfully",
        id: client.id,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async clientActivate(req, res) {
    try {
      const link = req.params.link;
      const client = await Client.findOne({ where: { activation_link: link } });

      if (!client) {
        return res.status(400).send({
          message: "Bunday client topilmadi",
        });
      }
      if (client.is_active) {
        return res
          .status(400)
          .send({ message: "Bu client avval faollashtrilgan" });
      }
      client.is_active = true;
      await client.save();

      res.send({
        message: "Client faollashtrildi",
        is_active: client.is_active,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new ClientController();
