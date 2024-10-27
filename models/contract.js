import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Freelancer from "./freelancer.js";
import Projects from "./projects.js";
const Contract = sequelize.define(
  "contract",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed", "canceled"),
    },
    contract_date: { type: DataTypes.DATEONLY, allowNull: false },
  },
  { timestamps: false }
);

Contract.belongsTo(Freelancer);
Freelancer.hasMany(Contract);

Contract.belongsTo(Projects);
Projects.hasMany(Contract);




export default Contract;
