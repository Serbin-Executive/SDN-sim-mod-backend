import { Router } from "express";
import { routerMiddleware } from "../middlewares/RouterMiddleware";
import { createModel, startModel, stopModel } from "../controllers/ModelController";
import { ApplicationRoutes } from "./meta";
import { applicationHeartbeat } from "../controllers/ApplicationController";

const router = Router();

router.get(ApplicationRoutes.HEARTBEAT, applicationHeartbeat);
router.get(ApplicationRoutes.CREATEMODEL, createModel);
router.get(ApplicationRoutes.STARTMODEL, startModel);
router.get(ApplicationRoutes.STOPMODEL, stopModel);

router.use(routerMiddleware);

export default router;
