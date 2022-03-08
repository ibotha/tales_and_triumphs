import { intArg, mutationField, nonNull, stringArg } from "nexus";
import { roleLevels, userAllowed } from "../Auth/worldAuth";
import { generateErrorType } from "./Errors";

export const AssignmentPayload = generateErrorType({
  name: "AssignmentPayload",
  wrappedType: "WorldRole",
});

export const Mutation = mutationField((t) => {
  t.field("assignWorldRole", {
    type: "AssignmentPayload",
    args: {
      userId: nonNull(stringArg()),
      worldId: nonNull(stringArg()),
      level: intArg(),
    },
    async resolve(parent, { userId, worldId, level }, context) {
      if (
        !(await userAllowed(
          worldId,
          Math.min(roleLevels.TRUSTED, level || roleLevels.ADMIN),
          context
        ))
      ) {
        return { errors: ["You do not have the right permissions!"] };
      }

      if (!level) {
        context.prisma.worldRole.delete({
          where: { userId_worldId: { userId, worldId } },
        });
        return { data: null };
      }

      return {
        data: context.prisma.worldRole.upsert({
          where: {
            userId_worldId: {
              worldId,
              userId,
            },
          },
          update: {
            level,
          },
          create: {
            worldId,
            userId,
            level,
          },
        }),
      };
    },
  });
});
