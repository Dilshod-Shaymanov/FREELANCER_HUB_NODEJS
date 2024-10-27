import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Client from "./clients.js";
import Freelancer from "./freelancer.js";
const Projects = sequelize.define(
  "project",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    budget: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed", "canceled"),
    },
    start_date: { type: DataTypes.DATEONLY },
    end_date: { type: DataTypes.DATEONLY },
  },
  { timestamps: false }
);




Projects.belongsTo(Client);
Client.hasMany(Projects);

Projects.belongsTo(Freelancer);
Freelancer.hasMany(Projects);


export default Projects;
