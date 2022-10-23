import { AuthenticatedRequest } from '../types';
import { serviceGetFollowingsById } from '../services/feed-service';
import { serviceGetPostsOfFollowings, serviceGetUsersSuggestions } from '../services/feed-service'
import {PAGE_LIMIT} from './posts-controller'
import {serviceGetUsers} from '../services/users-service'

export async function getFeedPosts(req: Request, res: Response) {
    const followingsList = req.following
    const followingAuthorsNameList = followingsList.map((follower) => {
        return follower._id.toHexString()
    })
    const page =  0
    const limit = 5
    const offset = page * PAGE_LIMIT
    const posts = await serviceGetPostsOfFollowings(followingAuthorsNameList)
    res.send(posts)
}

export async function FollowingsById(req: Request, res: Response, next: NextFunction) {
    const id = req.id.toHexString()
    const following = await serviceGetFollowingsById(id)
    req.following = following
    next()
}

export async function getFeedSuggestions(req: Request, res: Response) {
    const followingsList = req.following
    if(!followingsList.length) {
        const suggestions = await serviceGetUsersSuggestions(req.id)
        console.log(suggestions)
        // const suggestions = await serviceGetUsers()
        return res.send(suggestions)
    }
    const followingAuthorsNameList = followingsList.map((follower) => {
        return follower._id.toHexString()
    })
    followingAuthorsNameList.push(req.id.toHexString())
    const suggestions = await serviceGetUsersSuggestions(followingAuthorsNameList)
    return res.send(suggestions)
}