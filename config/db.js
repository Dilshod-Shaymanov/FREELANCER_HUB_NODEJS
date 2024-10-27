import config from "config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  config.get("db_name"),
  config.get("db_username"),
  config.get("db_password"),
  {
    dialect: "postgres",
    host: config.get("db_host"),
    logging: false,
    port: config.get("db_port"),
  }
);

export default sequelize;
