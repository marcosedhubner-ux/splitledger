import { Router } from "express";
import { addMemberSchema, createGroupSchema } from "./groups.schema.js";
import * as groupsService from "./groups.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { UnauthorizedError } from "../../domain/errors.js";
import { broadcastToGroup } from "../../realtime/socket.js";

export const groupsRouter = Router();

groupsRouter.use(authenticate);

groupsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const groups = await groupsService.listGroups(req.auth.userId);
    res.status(200).json({ groups });
  })
);

groupsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const input = createGroupSchema.parse(req.body);
    const group = await groupsService.createGroup(input, req.auth.userId);
    res.status(201).json({ group });
  })
);

groupsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const { id } = req.params as { id: string };
    const detail = await groupsService.getGroupDetail(id, req.auth.userId);
    res.status(200).json(detail);
  })
);

groupsRouter.post(
  "/:id/members",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const { id } = req.params as { id: string };
    const input = addMemberSchema.parse(req.body);
    const member = await groupsService.addMemberByEmail(id, input.email, req.auth.userId);
    broadcastToGroup(id, "group:updated", { groupId: id });
    res.status(201).json({ member });
  })
);
