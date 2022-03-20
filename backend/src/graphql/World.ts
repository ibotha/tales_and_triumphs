import { PrismaSelect } from "@paljs/plugins";
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
import { generateSelect } from "../Util/select";
import { generateErrorType } from "./Errors";

const exclude = [];

export const WorldWrapper = generateErrorType({
  name: "WorldWrapper",
  wrappedType: "World",
});

export const World = objectType({
  name: "World",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.field("myRole", {
      type: "RoleLevel",
      resolve: (parent, _, context) => {
        return getUserWorldRole(parent.id!, context);
      },
    });
    t.nonNull.field("creator", { type: "User" });
    t.nonNull.list.nonNull.field("roles", { type: "WorldRole" });
    t.nonNull.list.nonNull.field("categories", { type: "DocumentCategory" });
    t.nonNull.list.nonNull.field("documents", { type: "Document" });
    t.field("rootFolder", {
      type: "Folder",
      resolve: (parent, _, context, info) => {
        let select = generateSelect<Prisma.FolderSelect>()(info, {
          id: true,
        });
        return context.prisma.folder.findFirst({
          where: {
            AND: { worldId: parent.id, parentFolderId: null },
          },
          ...select,
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
    async resolve(parent, { name }, { prisma, req }, info) {
      let select = generateSelect<Prisma.WorldSelect>()(
        info,
        {
          id: true,
        },
        "data"
      );
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
          ...select,
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
      await context.prisma.world.delete({
        where: { id },
        select: { id: true },
      });
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
      let select = generateSelect<Prisma.WorldSelect>()(info, {
        id: true,
      });
      return prisma.world.findUnique({ where: { id }, ...select });
    },
  });
  t.nonNull.list.nonNull.field("worlds", {
    type: "World",
    resolve(parent, args, { prisma }, info) {
      let select = generateSelect<Prisma.WorldSelect>()(info, {
        id: true,
      });
      return prisma.world.findMany({ ...select });
    },
  });
  t.list.nonNull.field("myWorlds", {
    type: "World",
    resolve(parent, args, { prisma, req }, info) {
      if (!req.session.user) return [];
      let select = generateSelect<Prisma.WorldSelect>()(info, {
        id: true,
      });
      return prisma.world.findMany({
        where: { roles: { some: { userId: req.session.user.id } } },
        ...select,
      });
    },
  });
});
