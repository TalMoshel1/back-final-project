import { PostModel } from '../models/post'
import { serviceCreatePost, serviceGetFeed, serviceGetPost, serviceGetPostsByUsername, update, deletePost as deletePostService } from '../services/post-service'
import { NextFunction, Request, Response } from 'express'
import { validatyeIdLength } from '../middlewares/validatyeIdLength'
import { Errors } from '../util/PostsErrors'
import { Types } from 'mongoose'
import multer from 'multer'
import { AuthenticatedRequest } from '../types';

const PAGE_LIMIT = 5


export async function getPostById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const id = req.params.postId
    const isValid = validatyeIdLength(id)
    if (!isValid) {
        res.send(Errors.idLengthError)
    }
    const post = await serviceGetPost(id)
    if (!post) {
        return res.send('post is not exists')
    }
    return res.send(post)
}
export async function valdiateUserAsCreatorOfPost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const id = req.params.postId
    const myId = req.id?.toHexString
    const isValid = validatyeIdLength(id)
    if (isValid) {
        const post = await serviceGetPost(id)
        const userId = post?.author
        if (userId !== myId) {
            res.send(Errors.cantChangeOtherUserPost)
        } else {
            next()
        }

    } else {
        res.send(Errors.idLengthError)
        // res.status(401).send()
    }
}

export async function getPostsByUsername(req: Request, res: Response) {
    const username = req.params.username
    console.log(username)
    const posts = await serviceGetPostsByUsername(username)
    if (posts) {
        res.send(posts)
    } else {
        console.log('no posts yet')
        res.send(`post not found}`)
    }
}



export async function createProfilePicture(req: AuthenticatedRequest, res: Response) {
    try {
        if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/jpg') {
            return res.send(Errors.fileFormat)
        }

        let { path: media } = req.file
        const updatedMedia = media.replace('\\', '/') // trying to save it not as : uploads\\1664182746286-DoReMi.jpg
        // const postData = { media, body, author }
        // const post = await serviceCreatePost(postData)
        // console.log(req.file.mimetype)
        // res.send(post)

    } catch {
        res.send(Errors.noFile)
    }
}


/* */

export function getFilesErrors(files: {}[]) {
    const filesArray = files.map((file) => {
        const pairs = Object.entries(file)
        const errors = pairs.reduce((errorsArray: {}[], pair) => {
            if (pair[0] !== 'fieldname' && pair[0] !== 'originalname' && pair[0] !== 'encoding' && pair[0] !== 'mimetype' && pair[0] !== 'destination' && pair[0] !== 'filename' && pair[0] !== 'path' && pair[0] !== 'size') {
                errorsArray.push(Errors.invalidProp)
                console.log(pair[0])
            } else if (pair[0] === 'mimetype') {
                if (pair[1] !== 'image/jpeg' && pair[1] !== 'image/jpg' && pair[1] !== 'image/png') { // also png..
                    errorsArray.push(Errors.fileFormat)
                }
            }
            return errorsArray
        }, [])
        return errors
    })
    return filesArray[0]
}

export function getBodyErrors() {

}

export async function deletePost(req: AuthenticatedRequest, res: Response) {
    const postId = req.params.postId /* gives an id */
    if (postId.length !== 24) {
        return res.send('id is to short')
    }
    const postIdConverted = new Types.ObjectId(postId)
    const userId = req.id.toHexString()
    console.log(typeof(postId), postId)
    const user = await deletePostService(userId, postId)
    if (!user) {
        return res.send('post hasnt found')
    }
    return res.send(user)
}


export async function createPost(req: AuthenticatedRequest, res: Response) {
    const { body } = req.body
    const author = req.id
    if (!author) {
        res.send(Errors.noToken)
    }
    try {
        const files = req.files
        const filesErrors = getFilesErrors(files)
        if (filesErrors.length) {
            return res.send(filesErrors)
        }
        const mediaList = files.map(file => {
            let { path: media } = file
            return media
        })
        const postData = { mediaList, body, author }
        const post = await serviceCreatePost(postData)
        res.send(post)
    } catch {
        res.send(Errors.noFile)
    }
}

export async function updatePost(req: AuthenticatedRequest, res: Response) {
    const id = req.params.postId
    const files = req.files
    const errorsList = getFilesErrors(files)
    console.log(errorsList)
    if (errorsList.length) {
        return res.send(errorsList)
    }
    const myId = req.id
    const post = await serviceGetPost(id)
    const mediaList = files.map(file => {
        let { path: media } = file
        return media
    })
    if (!post) {
        return res.send('problem')
    }
    const userId = post.author
    if (userId != myId?.toHexString()) {
        return res.send(Errors.cantChangeOtherUserPost)
    } else {
        const { body } = req.body
        const postData = { mediaList, body }
        const post = await update(id, postData)
        res.send(post)
    }
}






//             const { body } = req.body
//             try {
//                 const files = req.files
//                 const mediaList = files.map((file) => {
//                     if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
//                         res.send(Errors.fileFormat)
//                     } else {
//                         let { path: media } = file
//                         return media
//                     }
//                 })
//                 const postData = { mediaList, body, myId }
//                 const post = await serviceCreatePost(postData)
//                 res.send(post)
//             } catch {
//                 res.send(Errors.noFile)
//             }
//         }
//     } else {
//         res.send(Errors.postNotFound)
//     }
// } else {
//     res.send(Errors.idLengthError)
//     // res.status(401).send()
// }


// export async function createPost(req: Request, res: Response) {
//     const { body } = req.body
//     const author = req.username
//     if (!author) {
//         res.send('not authorized')
//     }
//     if (body) {
//         try {
//             if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/jpg') { 
//                 res.send('please upload a file with extention of jpeg')
//             } else {
//                 let { path: media } = req.file
//                 const updatedMedia = media.replace('\\', '/') // trying to save it not as : uploads\\1664182746286-DoReMi.jpg
//                 const postData = { media, body, author }
//                 const post = await serviceCreatePost(postData)
//                 console.log(req.file.mimetype)
//                 res.send(post)
//             }
//         } catch {
//             res.send('image or video are required')
//         }
//     } else {
//         res.send('body required')
//     }
// }

export async function getFeed(req, res) {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 5
    const offset = page * PAGE_LIMIT

    const posts = await serviceGetFeed(offset, limit)
    // const listOfModifiedMediaList = posts.map((post) => {
    //     return post.mediaList.map((url) => {
    //         return url.replaceAll('\\', '/')
    //     })
    // })
    // const updatedPosts = posts.map((post, index)=>{
    //     post.mediaList = listOfModifiedMediaList[index]
    //     return post
    // })

    // if (listOfModifiedMediaList) {

    //     return res.send(listOfModifiedMediaList)
    // } else {
    //     return res.send('no posts yet')
    // }
    res.json(posts)
}


export function getPostComments() {

}

export function getPostLikes() {

}

export function likes() {

}

export function unlike() {

}


