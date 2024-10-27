import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Client from "./clients.js";
import Freelancer from "./freelancer.js";
import Projects from "./projects.js";

const Reviews = sequelize.define(
  "reviews",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    raiting: { type: DataTypes.STRING },
    comment: { type: DataTypes.STRING },
    date: { type: DataTypes.DATEONLY },
  },
  { timestamps: false }
);


Reviews.belongsTo(Client);
Client.hasMany(Reviews);

Reviews.belongsTo(Freelancer);
Freelancer.hasMany(Reviews);

Reviews.belongsTo(Projects);
Projects.hasMany(Reviews);

// Client.belongsToMany(Projects, { through: Reviews });
// Projects.belongsToMany(Client, { through: Reviews });

// Freelancer.belongsToMany(Projects, { through: Reviews });
// Projects.belongsToMany(Freelancer, { through: Reviews });


export default Reviews;
