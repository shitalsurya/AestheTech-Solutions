import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import assessmentsRouter from "./assessments";
import challengesRouter from "./challenges";
import paymentsRouter from "./payments";
import contactRouter from "./contact";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(assessmentsRouter);
router.use(challengesRouter);
router.use(paymentsRouter);
router.use(contactRouter);
router.use(adminRouter);

export default router;
