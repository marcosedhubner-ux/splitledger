import { Router } from "express";
import { recordPaymentSchema } from "./payments.schema.js";
import * as paymentsService from "./payments.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { UnauthorizedError } from "../../domain/errors.js";
import { broadcastToGroup } from "../../realtime/socket.js";

export const paymentsRouter = Router({ mergeParams: true });

paymentsRouter.use(authenticate);

paymentsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const { groupId } = req.params as { groupId: string };
    const input = recordPaymentSchema.parse(req.body);
    const payment = await paymentsService.recordPayment(groupId, input, req.auth.userId);
    broadcastToGroup(groupId, "group:updated", { groupId });
    res.status(201).json({ payment });
  })
);
