// @ts-nocheck
import { UserModel } from "../models/user";
import { Errors } from '../util/UserErrors.ts'

export async function serviceGetUsers() {
	const users = await UserModel.find()
	return (users)
}

export async function serviceGetUserById(id) {
	const user = await UserModel.findOne({ _id: id })
	return user
}


export async function serviceGetUserByUsername(username) {
	const user = await UserModel.findOne({ username: username })
	return user
}

export async function serviceUpdateUser(id, obj) {
	try {
		const user = await UserModel.findOneAndUpdate({ _id: id }, { $set: obj }, {
			new: true
		});
		return user
	}
	catch(err) {
		return err
	}

}

export async function serviceFollow(myId, otherUserId) {
	const updateUser = await UserModel.findOneAndUpdate({ _id: myId }, { $push: {following: otherUserId } }, {
		new: true
	});
	return updateUser
}

export async function serviceUnFollow(myId, otherUserId) {
	const updateUser = await UserModel.findOneAndUpdate({ _id: myId }, { $pull: {following: otherUserId } }, {
		new: true
	});
	return updateUser
}

// export async function serviceUpdateUser(id, prop: String, value) {
//     const user = await UserModel.findOneAndUpdate({ _id: id }, { $set: { [prop]: value } }, {
//         new: true
//     });
//     return user
// }

export async function serviceDeleteUser(id) {
	const user = await UserModel.findOneAndDelete({ _id: id })
	return user
}

export async function serviceCreateUser(user: any = {}) {
	if (!user.username) {
		throw new Error('username is required');
	}
	try {
		const newUser = new UserModel({
			fullname: user.fullname,
			username: user.username,
			password: user.password,
			email: user.email
		});
		await newUser.save() // למה לא מצליח לשמור וקודם כן
		return newUser;
	}
	catch (err) {
		console.log(err)
		// throw new Error(err)
	}
}

// serviceGetFollowing