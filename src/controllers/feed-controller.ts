import { AuthenticatedRequest } from '../types';
import { serviceGetFollowingsById } from '../services/feed-service';
import { serviceGetPostsOfFollowings } from '../services/feed-service'
import {PAGE_LIMIT} from './posts-controller'

export async function getFeed(req: Request, res: Response) {
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