export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
}

export function toPublicUser(user: { id: string; fullName: string; email: string }): PublicUser {
  return { id: user.id, fullName: user.fullName, email: user.email };
}
