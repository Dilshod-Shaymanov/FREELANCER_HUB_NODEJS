import express from "express";
import config from "config";
import sequelize from "./config/db.js";
import mainIndexRouter from "./routes/index.routes.js";
import error_handling_middleware from "./middleware/error_handling_middleware.js";
import cookieParser from "cookie-parser";
import logger from "./services/logger_serice.js";

const PORT = config.get("port");
const app = express();

app.use(express.json());
app.use(cookieParser());

logger.error("Logger Error");
// logger.info("Logger Error");

app.use("/api", mainIndexRouter);
app.use(error_handling_middleware);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

start();

// o'rnatish kerak bo'lgan packagelar
// npm i bcryptjs config cookie-parser express joi jsonwebtoken node-cache nodemailer otp-generator pg sequelize uuid winston
