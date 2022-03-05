import {
	objectType,
	nonNull,
	stringArg,
	mutationField,
	queryField,
} from "nexus";

export const User = objectType({
	name: "User",
	definition(t) {
		t.nonNull.id("id");
		t.nonNull.string("username");
		t.nonNull.string("email");
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

export const userMutation = mutationField((t) => {});
