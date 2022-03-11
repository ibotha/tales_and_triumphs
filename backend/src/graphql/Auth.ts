import { mutationField, nonNull, objectType, stringArg } from "nexus";
import { hash, verify } from "argon2";
import { ValidationError } from "apollo-server-express";
import { registerUserSchema } from "../Validation/userValidation";

export const authMutation = mutationField((t) => {
  t.field("register", {
    type: "UserPayload",
    args: {
      username: nonNull(stringArg()),
      email: nonNull(stringArg()),
      password: nonNull(stringArg()),
    },
    async resolve(parent, args, context) {
      try {
        registerUserSchema.validateSync(args, {
          abortEarly: false,
        });
      } catch (e: any) {
        let fieldErrors = (e.inner as ValidationError[]).map((e) => ({
          field: e.path,
          message: e.message,
        }));
        console.log(fieldErrors);
        return {
          fieldErrors,
        };
      }
      let { username, email, password } = args;
      email = email.toLowerCase();
      let pwHash = await hash(password);
      try {
        let user = await context.prisma.user.create({
          data: {
            email,
            pwHash,
            username,
          },
        });
        context.req.session.user = user;
        return { data: user };
      } catch (e: any) {
        switch (e.code) {
          case "P2002":
            return {
              fieldErrors: [
                { field: "email", message: "email address already in use" },
              ],
            };
        }
        console.log(e.code);
      }
      return { errors: ["Something went Wrong!"] };
    },
  });

  t.field("login", {
    type: "UserPayload",
    args: {
      email: nonNull(stringArg()),
      password: nonNull(stringArg()),
    },
    async resolve(parent, { email, password }, context) {
      email = email.toLowerCase();
      let user = await context.prisma.user.findUnique({ where: { email } });
      if (!user)
        return {
          fieldErrors: [
            { field: "email", message: "Could not find that email" },
          ],
        };
      if (!(await verify(user.pwHash, password))) {
        console.log(password);
        return {
          fieldErrors: [{ field: "password", message: "Incorrect password" }],
        };
      }
      context.req.session.user = user;
      return { data: user };
    },
  });

  t.field("logout", {
    type: "Boolean",
    args: {},
    resolve(parent, {}, context) {
      if (!context.req.session.user) return false;
      context.req.session.user = undefined;
      return true;
    },
  });
});
