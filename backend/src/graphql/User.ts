import { hash, verify } from "argon2";
import { objectType, stringArg, mutationField, queryField } from "nexus";
import { ValidationError } from "yup";
import { updateUserSchema } from "../Validation/userValidation";
import { generateErrorType } from "./Errors";
import { generateSelection } from "../Util/select";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("username");
    t.string("email", {
      resolve: (parent, _, context) => {
        if (parent.id == context.req.session.user?.id)
          return parent.email || null;
        return null;
      },
    });
    t.nonNull.list.nonNull.field("createdWorlds", { type: "World" });
    t.nonNull.list.nonNull.field("roles", { type: "WorldRole" });
  },
});

export const UserPayload = generateErrorType({
  name: "UserPayload",
  wrappedType: "User",
});

export const userQuery = queryField((t) => {
  t.nonNull.list.nonNull.field("users", {
    type: "User",
    async resolve(parent, args, context, info) {
      const select = generateSelection<"User">(info);
      let user = await context.prisma.user.findMany({ ...select });
      return user;
    },
  });

  t.field("me", {
    type: "User",
    resolve(parent, _, context, info) {
      const select = generateSelection<"User">(info);
      if (!context.req.session.user) return null;
      return context.prisma.user.findUnique({
        where: { id: context.req.session.user.id },
        ...select,
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
    resolve: async (parent, args, context, info) => {
      if (!context.req.session.user) return { errors: ["Must be logged in!"] };
      const select = generateSelection<"User">(info, "data");

      // Validate against update Schema
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

      // If providing a new Password validate against the old one.
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

      // Update the user and return the changes
      let user = await context.prisma.user.update({
        where: { id: context.req.session.user.id },
        data: {
          pwHash: args.password
            ? await hash(args.password, { saltLength: 16 })
            : undefined,
          username: args.username || undefined,
        },
        ...select,
      });
      return { data: user };
    },
  });
});
