import { errorHandler } from "../helpers/error_handler.js";
import { paymentValidations } from "../validations/payments_validation.js";
import Payments from "../models/payments.js";

class PaymentsController {
  async addPayment(req, res) {
    try {
      const { error, value } = paymentValidations(req.body);
      if (error) {
        return res.status(400).send({
          error: error.message,
        });
      }
      const { amount, contractId, payment_type, date } = value;

      const payment = await Payments.create({
        amount,
        contractId,
        payment_type,
        date,
      });
      res.send({
        message: "Payment added successfully",
        payment,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async getPayments(req, res) {
    try {
      const payments = await Payments.findAll({
        include:{all:true}
      });
      if (!payments) {
        return res.status(404).send({
          message: "No payments found!",
        });
      }
      res.send(payments);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await Payments.findByPk(id);

      if (!payment) {
        return res.status(404).send({
          message: "Payment not found",
        });
      }
      res.send({
        message: "Payment fetched successfully",
        data: payment,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async deletePaymentById(req, res) {
    try {
      const { id } = req.params;
      const result = await Payments.destroy({
        where: { id: id },
      });

      if (result === 0) {
        return res.status(404).send({
          message: "Payment not found",
        });
      }

      res.send({
        message: "Payment deleted successfully",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async updatePaymentById(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = paymentValidations(req.body);
      if (error) {
        return res.status(400).send({ error: error.message });
      }

      const payment = await Payments.findByPk(id);
      if (!payment) {
        return res.status(404).send({
          message: "Payment not found",
        });
      }
      const updatedPayment = await Payments.update(
        { ...value },
        { where: { id: id }, returning: true }
      );

      res.send({
        message: "Payment updated successfully",
        data: updatedPayment[1][0],
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
export default new PaymentsController();
