import jwt from "jsonwebtoken";
import { prisma } from "../../db/client.js";
import { env } from "../../config/env.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../domain/errors.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { toPublicUser } from "../../utils/userMapper.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

export interface AuthTokenPayload {
  userId: string;
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { fullName: input.fullName, email: input.email, passwordHash },
  });

  const token = signToken({ userId: user.id });
  return { token, user: toPublicUser(user) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new UnauthorizedError();
  }

  const passwordMatches = await comparePassword(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new UnauthorizedError();
  }

  const token = signToken({ userId: user.id });
  return { token, user: toPublicUser(user) };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("User");
  }
  return toPublicUser(user);
}

export function signToken(payload: AuthTokenPayload): string {
  const options = { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions;
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
