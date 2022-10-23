import { UserModel } from "../models/user";
import { PostModel } from '../models/post';

export async function serviceGetFollowingsById(id) {
    const user = await UserModel.findOne({ _id: id })
    const userFollows = user?.following // sopouse to contain id's of string
    const followed = await UserModel.find({ '_id': { $in: userFollows } })
    const usersProps = followed.map((userProps) => {
        const { username, following, _id } = userProps
        return { username, following, _id }
    })
    return usersProps
}

export async function serviceGetPostsOfFollowings(Followings, offset = 0, limit = 5) {
    const posts = await PostModel.find({ 'author': { $in: Followings } }).sort({created: -1}).skip(offset).limit(limit)
    return posts
}

export async function serviceGetUsersSuggestions(Followings, offset = 0, limit = 5) {
    const usersSuggestions = await UserModel.find({ '_id': { $nin: Followings } })
    return usersSuggestions
}