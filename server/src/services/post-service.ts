import { PostModel } from '../models/post'
import { Types } from 'mongoose'


interface IPost {
    author: Types.ObjectId;
    mediaList: String[];
    body: String | undefined;
    username: String;
    caption?: String;
}

interface IPost {
    mediaList: String[];
    body: String | undefined;
    caption?: String;
}


export async function serviceCreatePost(postData: IPost) {
    const newPost = await PostModel.create(postData)
    return newPost
}

export async function deletePost(userId: string, postId: string) {
    const user = await PostModel.findOneAndDelete({ author: userId, _id: postId  })
	return user
}

export async function update(postId, postDataUpdate){
    const user = await PostModel.findOneAndUpdate({ _id: postId }, { $set: postDataUpdate }, {
		new: true
	});
	return user
    return []
}

export async function serviceGetFeed(offset = 0, limit = 5) {
    const allPosts = await PostModel.find({}).sort({created: -1}).skip(offset).limit(limit)
    return allPosts
}

export async function serviceGetPost(id) {
    const post = await PostModel.findOne({_id: id})
    return post
}

export async function serviceGetPostsByUsername(username: string){
    const allPosts = await PostModel.find({username: username}).populate("author")
    return allPosts
}

export default {
    update,
    deletePost,
    serviceGetPostsByUsername,
    serviceGetPost
}

