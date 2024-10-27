import { errorHandler } from "../helpers/error_handler.js";
import { contractValidations } from "../validations/contract_validation.js";
import Contract from "../models/contract.js";

class ContractController {
  async addContract(req, res) {
    try {
      const { error, value } = contractValidations(req.body);
      if (error) {
        return res.status(400).send({
          error: error.message,
        });
      }
      const { projectId, freelancerId, status, contract_date } = value;
      const contract = await Contract.create({
        projectId,
        freelancerId,
        status,
        contract_date,
      });

      res.send({
        message: "Contract added successfully",
        contract
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getContracts(req, res) {
    try {
      const contracts = await Contract.findAll({
        include:{all:true}
      });
      if (!contracts) {
        return res.status(404).send({
          message: "No contracts found!",
        });
      }
      res.send(contracts);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getContractById(req, res) {
    try {
      const { id } = req.params;
      const contract = await Contract.findByPk(id);

      if (!contract) {
        return res.status(404).send({
          message: "Contract not found",
        });
      }

      res.send({
        message: "Contract fetched successfully",
        data: contract,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async deleteContractById(req, res) {
    try {
      const { id } = req.params;
      const result = await Contract.destroy({
        where: { id: id },
      });

      if (result === 0) {
        return res.status(404).send({
          message: "Contract not found",
        });
      }

      res.send({
        message: "Contract deleted successfully",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async updateContractById(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = contractValidations(req.body);
      if (error) {
        return res.status(400).send({ error: error.message });
      }

      const contract = await Contract.findByPk(id);
      if (!contract) {
        return res.status(404).send({
          message: "Contract not found",
        });
      }

      const updatedContract = await Contract.update(
        { ...value },
        { where: { id: id }, returning: true }
      );

      res.send({
        message: "Contract updated successfully",
        data: updatedContract[1][0],
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new ContractController();
