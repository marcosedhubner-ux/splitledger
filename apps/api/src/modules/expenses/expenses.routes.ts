import { Router } from "express";
import { createExpenseSchema } from "./expenses.schema.js";
import * as expensesService from "./expenses.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { UnauthorizedError } from "../../domain/errors.js";
import { broadcastToGroup } from "../../realtime/socket.js";

export const expensesRouter = Router({ mergeParams: true });

expensesRouter.use(authenticate);

expensesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const { groupId } = req.params as { groupId: string };
    const input = createExpenseSchema.parse(req.body);
    const expense = await expensesService.createExpense(groupId, input, req.auth.userId);
    broadcastToGroup(groupId, "group:updated", { groupId });
    res.status(201).json({ expense });
  })
);

expensesRouter.delete(
  "/:expenseId",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const { groupId, expenseId } = req.params as { groupId: string; expenseId: string };
    await expensesService.deleteExpense(groupId, expenseId, req.auth.userId);
    broadcastToGroup(groupId, "group:updated", { groupId });
    res.status(204).send();
  })
);
