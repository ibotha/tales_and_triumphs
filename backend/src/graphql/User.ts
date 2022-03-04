import { objectType, nonNull, stringArg, mutationField, queryField } from "nexus";
import { NexusGenObjects } from "../../generated/nexus-typegen";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.id("id")
        t.nonNull.string("username")
        t.nonNull.string("email")
    }
})

let users: NexusGenObjects["User"][] = [
    {
        id: "1",
        email: "billy.bob@gmail.com",
        username: "Billy"
    },
    {
        id: "2",
        email: "jinny.weasly@gmail.com",
        username: "Jinny"
    }
]

export const userQuery = queryField((t) => {
    t.nonNull.list.nonNull.field("users", {
        type: "User",
        resolve(parent, args, context, info) {
            return context.prisma.user.findMany();
        }
    })
})

export const userMutation = mutationField((t) => {
    t.field("registerUser", {
        type: "User",
        args: {
            username: nonNull(stringArg()),
            email: nonNull(stringArg()),
        },
        async resolve(parent, args, { prisma }) {
            const { username, email } = args;

            const user = await prisma.user.create({ data: { email, username } });
            return user;
        }
    })
})