import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Freelancer = sequelize.define(
  "freelancer",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    skills: { type: DataTypes.ARRAY(DataTypes.STRING) },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
    activation_link: { type: DataTypes.STRING(2000) },
    token: { type: DataTypes.STRING(2000) },
  },
  { timestamps: false }
);

export default Freelancer;
