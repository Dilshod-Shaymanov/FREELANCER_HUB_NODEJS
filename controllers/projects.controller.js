import { errorHandler } from "../helpers/error_handler.js";
import { projectValidations } from "../validations/projectsValidation.js";
import Projects from "../models/projects.js";

class ProjectsController {
  async addProject(req, res) {
    try {
      const { error, value } = projectValidations(req.body);
      if (error) {
        return res.status(400).send({
          error: error.message,
        });
      }
      const {
        clientId,
        freelancerId,
        title,
        description,
        budget,
        status,
        start_date,
        end_date,
      } = value;

      const project = await Projects.create({
        clientId,
        freelancerId,
        title,
        description,
        budget,
        status,
        start_date,
        end_date,
      });

      res.send({
        message: "Project added successfully",
        project: project,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async getProjects(req, res) {
    try {
      const projects = await Projects.findAll({
        include:{all:true}
      });
      if (!projects) {
        return res.status(404).send({
          message: "No projects found!",
        });
      }
      res.send(projects);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const project = await Projects.findByPk(id);

      if (!project) {
        return res.status(404).send({
          message: "Project not found",
        });
      }

      res.send({
        message: "Project fetched successfully",
        data: project,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async deleteProjectById(req, res) {
    try {
      const { id } = req.params;
      const result = await Projects.destroy({
        where: { id: id },
      });

      if (result === 0) {
        return res.status(404).send({
          message: "Project not found",
        });
      }

      res.send({
        message: "Project deleted successfully",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async updateProjectById(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = projectValidations(req.body);
      if (error) {
        return res.status(400).send({ error: error.message });
      }

      const project = await Projects.findByPk(id);
      if (!project) {
        return res.status(404).send({
          message: "Project not found",
        });
      }

      const updatedProject = await Projects.update(
        { ...value },
        { where: { id: id }, returning: true }
      );

      res.send({
        message: "Project updated successfully",
        data: updatedProject[1][0],
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new ProjectsController();
