import { Prisma, User } from "@prisma/client";
import {
  idArg,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import { roleLevels, userAllowed } from "../Auth/worldAuth";
import { generateErrorType } from "./Errors";

export const WorldWrapper = generateErrorType({
  name: "WorldWrapper",
  wrappedType: "World",
});

export const WorldRole = objectType({
  name: "WorldRole",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.field("user", {
      type: "User",
      async resolve(parent, args, { prisma }) {
        console.log(parent);
        let user = await prisma.worldRole
          .findUnique({ where: { id: parent.id } })
          .user();
        if (!user) throw Error("Could not find a valid role");
        return user;
      },
    });
    t.nonNull.field("world", {
      type: "World",
      async resolve(parent, args, { prisma }) {
        console.log(parent);
        let user = await prisma.worldRole
          .findUnique({ where: { id: parent.id } })
          .world();
        if (!user) throw Error("Could not find a valid role");
        return user;
      },
    });
    t.nonNull.int("level");
  },
});

export const World = objectType({
  name: "World",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.field("creator", {
      type: "User",
      async resolve(parent, args, { prisma }) {
        console.log(parent);
        let user = await prisma.world
          .findUnique({ where: { id: parent.id } })
          .creator();
        if (!user) throw Error("Could not find a valid user");
        return user;
      },
    });
    t.nonNull.list.nonNull.field("users", {
      type: "User",
      async resolve(parent, args, { prisma }) {
        console.log(parent);
        let roles = await prisma.world
          .findUnique({ where: { id: parent.id } })
          .roles();
        let users = roles.map(async (r) => {
          let user:
            | (User & {
                role?: number;
              })
            | null = await prisma.user.findUnique({
            where: { id: r.userId },
          });
          if (user) {
            user.role = r.level;
            console.log(user);
          }
          return user;
        });
        users = users.filter((u) => {
          return u !== null;
        });
        console.log(users);
        return users as Prisma.Prisma__UserClient<User>[];
      },
    });
  },
});

export const worldMutation = mutationField((t) => {
  t.field("createWorld", {
    type: "WorldWrapper",
    args: {
      name: nonNull(stringArg()),
    },
    async resolve(parent, { name }, { prisma, req }) {
      // TODO: Move auth check into a central location.
      if (!req.session.user)
        return {
          errors: ["Must be logged in!"],
        };

      try {
        let world = await prisma.world.create({
          data: {
            name,
            creator: { connect: { id: req.session.user.id } },
            roles: {
              create: {
                userId: req.session.user.id,
                level: 0,
              },
            },
          },
        });
        return { data: world };
      } catch (e: any) {
        if (e.code === "P2002")
          return {
            errors: ["World names must be unique."],
          };
        console.log(e);
        return {
          errors: ["Something Happened!"],
        };
      }
    },
  });
  t.field("deleteWorld", {
    type: "Boolean",
    args: {
      id: nonNull(stringArg()),
    },
    async resolve(parent, { id }, context) {
      if (!(await userAllowed(id, roleLevels.ADMIN, context))) return false;
      await context.prisma.world.delete({ where: { id } });
      return true;
    },
  });
});

export const worldQuery = queryField((t) => {
  t.nonNull.list.nonNull.field("worlds", {
    type: "World",
    resolve(parent, args, { prisma }) {
      return prisma.world.findMany();
    },
  });
});
