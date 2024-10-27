import { Router } from "express";
import admin from "./admin.routes.js";
import client from "./client.routes.js";
import freelancer from "./freelancer.routes.js";
import reviews from "./reviews.routes.js";
import projects from "./projects.routes.js";
import contract from "./contract.routes.js";
import payments from "./payments.routes.js";
const mainIndexRouter = Router();

mainIndexRouter.use("/admin", admin);
mainIndexRouter.use("/client", client);
mainIndexRouter.use("/freelancer", freelancer);
mainIndexRouter.use("/reviews", reviews);
mainIndexRouter.use("/projects", projects);
mainIndexRouter.use("/contract", contract);
mainIndexRouter.use("/payments", payments);
export default mainIndexRouter;
