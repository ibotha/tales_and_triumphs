import { Prisma, User } from "@prisma/client";
import {
  idArg,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import {
  getUserWorldRole,
  roleLevels,
  userHasWorldRole,
} from "../Auth/worldAuth";
import { generateErrorType } from "./Errors";

export const WorldWrapper = generateErrorType({
  name: "WorldWrapper",
  wrappedType: "World",
});

export const World = objectType({
  name: "World",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("creatorId");
    t.nonNull.string("name");
    t.field("myRole", {
      type: "RoleLevel",
      resolve: (parent, _, context) => {
        return getUserWorldRole(parent.id, context);
      },
    });
    t.nonNull.field("creator", {
      type: "User",
      async resolve(parent, args, { prisma }) {
        let user = await prisma.user.findUnique({
          where: { id: parent.creatorId },
        });
        if (!user) throw Error("Could not find a valid user");
        return user;
      },
    });
    t.nonNull.list.nonNull.field("users", {
      type: "User",
      async resolve(parent, args, { prisma }) {
        let roles = await prisma.world
          .findUnique({ where: { id: parent.id } })
          .roles({ include: { user: {} } });
        let ret = roles.map((role) => {
          let user: any = role.user;
          user.role = role.level;
          return role.user;
        });
        return ret;
      },
    });
    t.nonNull.list.nonNull.field("categories", {
      type: "DocumentCategory",
      resolve: (parent, _, context) => {
        return context.prisma.documentCategory.findMany({
          where: { worldId: parent.id },
        });
      },
    });
    t.nonNull.list.nonNull.field("documents", {
      type: "Document",
      args: {
        parentFolderId: stringArg(),
      },
      resolve: (parent, { parentFolderId }, context) => {
        return context.prisma.document.findMany({
          where: {
            worldId: parent.id,
          },
        });
      },
    });
    t.field("rootFolder", {
      type: "Folder",
      resolve: (parent, _, context) => {
        return context.prisma.folder.findFirst({
          where: {
            AND: { worldId: parent.id, parentFolderId: null },
          },
        });
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
            creator: { connect: { id: req.session.user!.id } },
            roles: {
              create: {
                userId: req.session.user!.id,
                level: roleLevels.ADMIN,
              },
            },
            folders: {
              create: {
                name: "root",
                readAccessLevel: roleLevels.PUBLIC,
                creatorId: req.session.user!.id,
                edit: {
                  connect: { id: req.session.user!.id },
                },
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
      if (!(await userHasWorldRole(id, roleLevels.ADMIN, context)))
        return false;
      await context.prisma.world.delete({ where: { id } });
      return true;
    },
  });
});

export const worldQuery = queryField((t) => {
  t.field("world", {
    type: "World",
    args: {
      id: nonNull(stringArg()),
    },
    resolve(parent, { id }, { prisma }, info) {
      return prisma.world.findUnique({ where: { id } });
    },
  });
  t.nonNull.list.nonNull.field("worlds", {
    type: "World",
    resolve(parent, args, { prisma }, info) {
      return prisma.world.findMany();
    },
  });
  t.list.nonNull.field("myWorlds", {
    type: "World",
    resolve(parent, args, { prisma, req }) {
      if (!req.session.user) return null;

      return prisma.world.findMany({
        where: { roles: { some: { userId: req.session.user.id } } },
      });
    },
  });
});
