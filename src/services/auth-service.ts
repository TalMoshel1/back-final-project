import bcrypt from 'bcrypt'
import { UserModel } from '../models/user'
import { verify, sign } from 'jsonwebtoken'

export async function createUser(user: any = {}) {
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
	catch(err: any) {
		console.log(err)
		throw new Error(err)
	}
}

export async function getUserByUsername(username) {
	const user = await UserModel.findOne({ username: username })
	return user

}

export async function getUserByUsernameAndPassword(username, password) {
	const user = await UserModel.findOne({ username: username, password: password })
	return user

}

export async function updateTokenTimeOfUserDB(id, date) {
	const user = await UserModel.findOneAndUpdate({_id: id}, {tokenCreatedAt: date}, {new: true} )
	return user
}

export async function getTokenAndOptions(id, tokenDate):Promise<{token: string, options: {}}> { // token return "createdAt" (date) and "signAt" (id)
	const signUser = { id: id }
	const token = sign({ createdAt: tokenDate, signAt: signUser  }, process.env.SECRET)
	const options = {
		httpOnly: true
	}
	return {token, options}
}


export async function getUserById(userId) {
	const user = await UserModel.findById(userId)
	return user
}


// async function hashPassword(password) {
//     const hash = await bcrypt.hash(password, 10)
//     return hash
// }