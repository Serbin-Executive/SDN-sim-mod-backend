import { Router } from "express";
import { routerMiddleware } from "../middlewares/RouterMiddleware";
import { ApplicationRoutes } from "./meta";
import { applicationHeartbeat } from "../controllers/ApplicationController";

const router = Router();

router.get(ApplicationRoutes.HEARTBEAT, applicationHeartbeat);

router.use(routerMiddleware);

export default router;
