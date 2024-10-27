import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Contract from "./contract.js";

const Payments = sequelize.define(
  "payment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    amount: { type: DataTypes.DECIMAL(10, 2) },
    payment_type: {
      type: DataTypes.ENUM(
        "credit_card",
        "debit_card",
        "cash",
        "bank_transfer"
      ),
      allowNull: false,
    },
    date: { type: DataTypes.DATE, allowNull: false },
  },
  { timestamps: false }
);

Payments.belongsTo(Contract);
Contract.hasMany(Payments);

export default Payments;
