import { Context } from "../context";

export enum roleLevels {
  ADMIN,
  TRUSTED,
  USER,
}

type userAllowedOptions = {};

export const userAllowed = async (
  worldId: string,
  level: number,
  context: Context
): Promise<boolean> => {
  if (!context.req.session.user) return false;
  let userId = context.req.session.user.id;
  let role = await context.prisma.worldRole.findUnique({
    where: { userId_worldId: { worldId, userId } },
  });
  if (!role) return false;
  if (role.level <= level) return true;
  return false;
};
