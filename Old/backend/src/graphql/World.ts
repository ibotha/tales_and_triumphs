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
  userHasAccessLevelOnObject,
  userHasWorldRole,
} from "../Auth/worldAuth";
import { context } from "../context";
import { eObjectPermission, eObjectTypes, eWorldRole } from "../types";
import { generateSelection } from "../Util/select";
import { generateErrorType } from "./Errors";

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
    t.nonNull.list.nonNull.field("roles", { type: "WorldRole" });
    t.nonNull.list.nonNull.field("categories", { type: "DocumentCategory" });
    t.field("rootFolder", {
      type: "Folder",
      resolve: (parent, _, context, info) => {
        let select = generateSelection<"Folder">(info);
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
      let select = generateSelection<"World">(info, "data");
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
                level: eWorldRole.ADMIN,
              },
            },
          },
        });
        await prisma.folder.create({
          data: {
            name: "root",
            world: { connect: { id: world.id } },
            objectAccessControl: {
              create: {
                readAccessLevel: eWorldRole.PUBLIC,
                creator: {
                  connect: {
                    id: req.session.user!.id,
                  },
                },
                edit: {
                  connect: { id: req.session.user!.id },
                },
                type: eObjectTypes.Folder,
                world: {
                  connect: { id: world.id },
                },
              },
            },
          },
        });
        return {
          data: prisma.world.findUnique({ where: { id: world.id }, ...select }),
        };
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
    type: "World",
    args: {
      id: nonNull(stringArg()),
    },
    async resolve(parent, { id }, context, info) {
      let select = generateSelection<"World">(info);
      if (!(await userHasWorldRole(id, eWorldRole.ADMIN, context))) return null;
      return context.prisma.world.delete({
        where: { id },
        ...select,
      });
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
      let select = generateSelection<"World">(info);
      return prisma.world.findUnique({ where: { id }, ...select });
    },
  });
  t.nonNull.list.nonNull.field("worlds", {
    type: "World",
    resolve(parent, args, { prisma }, info) {
      let select = generateSelection<"World">(info);
      return prisma.world.findMany({ ...select });
    },
  });
  t.list.nonNull.field("myWorlds", {
    type: "World",
    resolve(parent, args, { prisma, req }, info) {
      if (!req.session.user) return [];
      const select = generateSelection<"World">(info);
      return prisma.world.findMany({
        where: { roles: { some: { userId: req.session.user.id } } },
        ...select,
      });
    },
  });
});
