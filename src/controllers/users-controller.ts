import { serviceGetUsers, serviceGetUserById, serviceUpdateUser, serviceDeleteUser, serviceGetUserByUsername, serviceCreateUser } from '../services/users-service';
import { UserModel } from '../models/user';
import { verify } from 'jsonwebtoken'
import { Request, Response } from 'express';
// import { notFound } from '../util/PostsErrors';
import bcrypt from 'bcrypt'
import { validatyeIdLength } from '../middlewares/validatyeIdLength'
import { Errors } from '../util/UserErrors'
import { AuthenticatedRequest } from '../types';
import { idErrors } from '../util/idErrors'


export async function getUsers(req: AuthenticatedRequest, res: Response) {
    const users = await serviceGetUsers()
    return res.send(users)

}

export function validateBodyUser(obj) {
    const fieldsArray = Object.keys(obj)
    const errors = fieldsArray.reduce((errorsArray: object[], field) => {
        console.log(errorsArray)
        if (field !== 'username' && field !== 'fullname' && field !== 'password' && field !== 'email') {
            errorsArray.push(Errors.invalidProp)
        }
        if (field === 'username') {
            if (obj[field].length <= 4) {
                errorsArray.push(Errors.usernameLength)
            }
        } else if (field === 'fullname') {
            if (!obj[field].includes(' ')) {
                errorsArray.push(Errors.fullname)
            }
        }
        if (field === 'password') {
            if (obj[field].length < 8) {
                errorsArray.push(Errors.password)

            }
        } else if (field === 'email') {
            if (!obj[field].includes('@')) {
                errorsArray.push(Errors.email)

            }
        }
        return errorsArray
    }, [])
    return errors
}


export async function createUser(req: AuthenticatedRequest, res: Response) {
    const { email, username, password, fullname } = req.body
    if (!(email && username && password && fullname)) {
        return res.send(Errors.missedFields)
    }
    const usernameExists = serviceGetUserByUsername(username)
    if (!usernameExists) {
        return res.send('username already Exists. choose different one')
    }

    const errors = validateBodyUser(req.body)
    if (errors.length !== 0) {
        return res.send(Errors)
    }
    const user = await serviceCreateUser(req.body)
    if (user) {
        return res.send(Errors)
    }
    return res.send(user)


}

export async function getUserById(req: Request, res: Response) {
    const id = req.params.userId
    console.log('working')
    console.log(id)
    const isValid = validatyeIdLength(id)
    if (!isValid) {
        return res.status(401).send(idErrors.idLength)
    }
    const user = await serviceGetUserById(id)
    if (!user) {
        return res.send(Errors.userDoesntExists)
    }
    return res.send(user)

}


export async function getUserByUsername(req: AuthenticatedRequest, res: Response) {
    const username = req.params.username
    const user = await serviceGetUserByUsername(username)
    if (!user) {
        return res.status(401).send()
    }
    return res.status(200).send({ username: user.username, email: user.email, following: user.following })
}



export async function updateUser(req: AuthenticatedRequest, res: Response) { // go to auth flow
    const idParams = req.params.userId
    const idVerify = req.id.valueOf()
    if (idParams !== idVerify) {
        return res.send(Errors.noToken)
    }
    const errors = validateBodyUser(req.body)   /* { [name]: name, [genre]: genre, "author": author, "similar": similar} */
    if (errors.length) {
        return res.send(errors)
    }
    const body = req.body
    const bodyList = Object.entries(body)
    // console.log(bodyList) /* [ [ 'password', '123456789' ], [ 'username', 'shakshuuu' ] ] */
    const result = {}
    bodyList.forEach((pair) => {
        const key = pair[0]
        const value = pair[1]
        result[key] = value
    })
    const updatedUser = await serviceUpdateUser(idVerify, result)
    if (!updatedUser) {
        return res.send(Errors)
    }
    return res.send(updatedUser)

}

export async function deleteUser(req: AuthenticatedRequest, res: Response) { // כאן הבאתי יוזר ניים מהפרמס
    const idParams = req.params.userId /* gives an id */
    // TODO: only the current user can delete its own!
    const idVerify = req.id?.toHexString()
    if (idVerify !== idParams) {
        return res.send(Errors)
    }
    const user = await serviceDeleteUser(idVerify)
    if (!user) {
        return res.send('user hasnt found')
    }
    return res.send(user)


}

// export async function getFollowers(req: Express.Request, res: Express.Response) {
//     // const id = req.user.id

// }

// export async function getMyFollowing(req: Express.Request, res: Express.Response) { // להביא ביצוע של פולו
//     const token = req['cookies']['cookieInsta']
//     const verifiedToken = (verify(token, process.env.SECRET))
//     const id = verifiedToken.signAt.id
//     const userFollowing = await serviceGetUserById(id)
//     console.log(userFollowing['following'])

// }

// export async function follow(req: AuthenticatedRequest, res: Response) { // using graph QL: (mutation, query, subscribtion, execution). not CRUD
//     // const id = req.params.username
//     const isValidId = validatyeIdLength(req.id?.toHexString())
//     if (isValidId) {
//         const user = await serviceGetUserById(req.id)
//         const { id, value } = req.body
//         if (id === 'id') {
//             if (validatyeIdLength(value)) {

//             } else {

//             }
//         }
//     }
    // const token = req['cookies']['cookieInsta']
    // const verifiedToken = (verify(token, process.env.SECRET))
    // const id = verifiedToken.signAt.id
    // const username = req['body'].username
    // console.log(username)

