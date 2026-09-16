import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { groupsRouter } from "./modules/groups/groups.routes.js";
import { expensesRouter } from "./modules/expenses/expenses.routes.js";
import { paymentsRouter } from "./modules/payments/payments.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { apiRateLimiter } from "./middlewares/rateLimiters.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(apiRateLimiter);

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.use("/auth", authRouter);
  app.use("/groups", groupsRouter);
  app.use("/groups/:groupId/expenses", expensesRouter);
  app.use("/groups/:groupId/payments", paymentsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
