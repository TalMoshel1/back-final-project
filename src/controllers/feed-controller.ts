// @ts-nocheck
import { AuthenticatedRequest } from '../types__interfaces';
import { serviceGetFollowingsById } from '../services/feed-service';
import { serviceGetPostsOfFollowings, serviceGetUsersSuggestions } from '../services/feed-service'
import {PAGE_LIMIT} from './posts-controller'
import {serviceGetUsers} from '../services/users-service'
import { Request, Response } from 'express';

export async function getFeedPosts(req: AuthenticatedRequest, res: Response) {
    const followingsList = req.following
    const followingAuthorsNameList = followingsList.map((follower) => {
        return follower._id.toHexString()
    })
    const page =  parseInt(req.query.offset)
    const offset = page * PAGE_LIMIT
    const posts = await serviceGetPostsOfFollowings(followingAuthorsNameList, offset)
    res.send(posts)
}

export async function FollowingsById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const id = req.id?.toHexString()
    const following = await serviceGetFollowingsById(id)
    req.following = following
    next()
}

export async function getFeedSuggestions(req: AuthenticatedRequest, res: Response) {
    const followingsList = req.following
    if(!followingsList.length) {
        const suggestions = await serviceGetUsersSuggestions(req.id)
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