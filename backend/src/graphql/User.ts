import { hash, verify } from "argon2";
import {
  objectType,
  nonNull,
  stringArg,
  mutationField,
  queryField,
} from "nexus";
import { ValidationError } from "yup";
import { updateUserSchema } from "../Validation/userValidation";
import { generateErrorType } from "./Errors";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("username");
    t.string("email", {
      resolve: (parent: any, _, context) => {
        if (parent.id == context.req.session.user?.id) return parent.email;
        return null;
      },
    });
    t.nonNull.list.nonNull.field("createdWorlds", {
      type: "World",
      resolve(parent, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .createdWorlds();
      },
    });
    t.nonNull.list.nonNull.field("roles", {
      type: "WorldRole",
      resolve(parent, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .roles();
      },
    });
    t.int("role", {
      description: "Role level within the context of the world.",
    });
  },
});

export const UserPayload = generateErrorType({
  name: "UserPayload",
  wrappedType: "User",
});

export const userQuery = queryField((t) => {
  t.nonNull.list.nonNull.field("users", {
    type: "User",
    resolve(parent, args, context, info) {
      return context.prisma.user.findMany();
    },
  });

  t.field("me", {
    type: "User",
    resolve(parent, _, context) {
      if (!context.req.session.user) return null;
      return context.prisma.user.findUnique({
        where: { id: context.req.session.user.id },
      });
    },
  });
});

export const userMutation = mutationField((t) => {
  t.field("updateUser", {
    type: "UserPayload",
    args: {
      username: stringArg(),
      password: stringArg(),
      newPassword: stringArg(),
    },
    resolve: async (parent, args, context) => {
      if (!context.req.session.user) return { errors: ["Must be logged in!"] };
      try {
        await updateUserSchema.validate(args, { abortEarly: false });
      } catch (e: any) {
        let fieldErrors = (e.inner as ValidationError[]).map((e) => ({
          field: e.path,
          message: e.message,
        }));
        return {
          fieldErrors,
        };
      }
      if (args.newPassword) {
        let user = await context.prisma.user.findUnique({
          where: { id: context.req.session.user.id },
          select: { pwHash: true },
        });
        if (!user) {
          return { errors: ["Could not find user"] };
        }
        if ((await verify(user.pwHash, args.password!)) !== true)
          return {
            fieldErrors: [{ field: "password", message: "Incorrect Password" }],
          };
      }
      let user = await context.prisma.user.update({
        where: { id: context.req.session.user.id },
        data: {
          pwHash: args.password
            ? await hash(args.password, { saltLength: 16 })
            : undefined,
          username: args.username || undefined,
        },
      });
    },
  });
});
