import { mutationField, nonNull, objectType, stringArg } from "nexus";
import {hash, verify} from 'argon2'

export const authMutation = mutationField((t) => {
	t.field('register', {
		type: 'User',
		args: {
			username: nonNull(stringArg()),
			email: nonNull(stringArg()),
			password: nonNull(stringArg())
		},
		async resolve(parent, {username, email, password}, context) {
			let pwHash = await hash(password);
			let user = await context.prisma.user.create({data:{
				email,
				pwHash,
				username
			}})
			context.req.session.user = user;
			return user;
		}
	})

	t.field('login', {
		type: 'User',
		args: {
			email: nonNull(stringArg()),
			password: nonNull(stringArg())
		},
		async resolve(parent, { email, password }, context) {
			let user = await context.prisma.user.findUnique({where:{email}});
			if (!user) throw Error("Invalid Email Address");
			if (!verify(user.pwHash, password)) throw Error("Invalid Password");
			context.req.session.user = user;
			return user
		}
	})

	t.field('logout', {
		type: 'Boolean',
		args: {
			
		},
		resolve(parent, {  }, context) {
			if (!context.req.session.user)
				return false;
			context.req.session.user = undefined;
			return true;
		}
	})
})