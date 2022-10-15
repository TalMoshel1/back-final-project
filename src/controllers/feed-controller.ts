import { AuthenticatedRequest } from '../types';
import { serviceGetFollowersById } from '../services/feed-service';


export async function getFeed(req: AuthenticatedRequest, res: Response) {
    const id = req.id.toHexString()
    const feed = await serviceGetFollowersById(id)
    return res.send(feed)


}