import { errorHandler } from "../helpers/error_handler.js";
import { reviewValidations } from "../validations/reviews_validation.js";
import Reviews from "../models/reviews.js";
import Client from "../models/clients.js";

class ReviewsController {
  async addReview(req, res) {
    try {
      const { error, value } = reviewValidations(req.body);
      if (error) {
        return res.status(400).send({
          error: error.message,
        });
      }
      const {
        clientId,
        freelancerId,
        projectId,
        raiting,
        comment,
        date,
      } = value;
      const clientExists = await Client.findByPk(clientId);
      if (!clientExists) {
        return res.status(404).send({ message: "Client not found!" });
      }

      const review = await Reviews.create({
        clientId,
        freelancerId,
        projectId,
        raiting,
        comment,
        date,
      });

      res.send({
        message: "Review added successfully",
        review
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getReviews(req, res) {
    try {
      const reviews = await Reviews.findAll({
        include:{all:true}
      });
      if (!reviews) {
        return res.status(404).send({
          message: "No reviews found!",
        });
      }
      res.send(reviews);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getReviewById(req, res) {
    try {
      const { id } = req.params;
      const review = await Reviews.findByPk(id);

      if (!review) {
        return res.status(404).send({
          message: "Review not found",
        });
      }

      res.send({
        message: "Review fetched successfully",
        data: review,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async deleteReviewById(req, res) {
    try {
      const { id } = req.params;
      const result = await Reviews.destroy({
        where: { id: id },
      });

      if (result === 0) {
        return res.status(404).send({
          message: "Review not found",
        });
      }

      res.send({
        message: "Review deleted successfully",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async updateReviewById(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = reviewValidations(req.body);
      if (error) {
        return res.status(400).send({ error: error.message });
      }

      const review = await Reviews.findByPk(id);
      if (!review) {
        return res.status(404).send({
          message: "Review not found",
        });
      }

      const updatedReview = await Reviews.update(
        { ...value },
        { where: { id: id }, returning: true }
      );

      res.send({
        message: "Review updated successfully",
        data: updatedReview[1][0],
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new ReviewsController();
