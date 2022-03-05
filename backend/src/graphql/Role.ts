import { intArg, mutationField, nonNull, stringArg } from "nexus";
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
			level: nonNull(intArg()),
		},
		async resolve(parent, { userId, worldId, level }, context) {
			if (!context.req.session.user)
				return { errors: ["Must be logged in!"] };

			let role = await context.prisma.worldRole.findUnique({
				where: {
					userId_worldId: {
						userId: context.req.session.user.id,
						worldId,
					},
				},
			});
			if (role && role.level == 0) {
				return {
					data: context.prisma.worldRole.create({
						data: {
							worldId,
							userId,
							level,
						},
					}),
				};
			}

			return {
				errors: [
					"You don't appear to have enough permissions in that world!",
				],
			};
		},
	});
});
