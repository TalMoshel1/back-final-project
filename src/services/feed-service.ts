import { UserModel } from "../models/user";

export async function serviceGetFollowersById(id) {
	const user = await UserModel.findOne({ _id: id })
	const userFollows = user?.following // sopouse to contain id's of string
    const followed = await UserModel.find({'_id': { $in: [userFollows]}} )
    return followed
}