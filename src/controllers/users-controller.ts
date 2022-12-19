import { serviceGetUsers, serviceGetUserById, serviceUpdateUser, serviceDeleteUser, serviceGetUserByUsername, serviceCreateUser, serviceFollow, serviceUnFollow } from '../services/users-service';
import { UserModel } from '../models/user';
import { verify } from 'jsonwebtoken'
import { NextFunction, Response } from 'express';
import {Request, RequestBody} from '../types__interfaces'
import bcrypt from 'bcrypt'
import { validatyeIdLength } from '../middlewares/validatyeIdLength'
import { Errors } from '../util/UserErrors'
import { idErrors } from '../util/idErrors'
import {getFilesErrors} from '../controllers/posts-controller'



export async function getUsers(req: Request, res: Response) {
    const users = await serviceGetUsers()
    return res.send(users)

}

export function validateBodyUser(obj: RequestBody) {
    const fieldsArray = Object.keys(obj)
    const errors = fieldsArray.reduce((errorsArray: object[], field) => {
        if (field !== 'username' && field !== 'fullname' && field !== 'password' && field !== 'email' && field !== 'file' && field !== 'media') {
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


export async function createUser(req: Request, res: Response) {
    const { email, username, password, fullname } = req.body
    if (!(email && username && password && fullname)) {
        res.send(Errors.missedFields)
        return 
    }
    const usernameExists = serviceGetUserByUsername(username)
    if (!usernameExists) {
        res.send('username already Exists. choose different one')
        return
    }

    const errors = validateBodyUser(req.body)
    if (errors.length !== 0) {
        res.send(Errors)
        return
    }
    const user = await serviceCreateUser(req.body)
    if (user) {
        res.send(Errors)
        return
    }
    res.send(user)
    return


}

export async function getUserById(req: Request, res: Response) {
    const id = req.params.userId
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


export async function getUserByUsername(req: Request, res: Response) {
    const username = req.params.username
    const user = await serviceGetUserByUsername(username)
    if (!user) {
        return res.status(401).send()
    }
    return res.status(200).send({ username: user.username, email: user.email, following: user.following })
}


export async function updateUser(req: Request, res: Response) { // go to auth flow
    const idParams = req.params.userId
    const idVerify = req.id?.valueOf()
    if (idParams !== idVerify) {
        return res.send(Errors.noToken)
    }
    const errors = validateBodyUser(req.body)   /* { [name]: name, [genre]: genre, "author": author, "similar": similar} */
    if (errors.length) {
        return res.send(errors)
    }
    const body = req.body
    const bodyList = Object.entries(body)
    const propsToChange = {media:''}
    bodyList.forEach((pair) => {
        const key = pair[0]
        const value = pair[1]
        propsToChange[key] = value
    })
    try {
        if (req.file?.path) {
            const media = req.file //   מחזיר Undefined ונכנס ל catch
            const fileErrors = getFilesErrors([media])
            if (fileErrors.length) {
                return res.send(fileErrors)
            }
            propsToChange.media = media.path
            const updatedUser = await serviceUpdateUser(idVerify, propsToChange)
            if (!updatedUser) {
                return res.send(Errors)
            }
            return res.send(updatedUser)
        } else {
            propsToChange.media = ''
            const updatedUser = await serviceUpdateUser(idVerify, propsToChange)
            if (!updatedUser) {
                return res.send(Errors)
            }
            return res.send(updatedUser)
        }

    } catch(e) {
        const updatedUser = await serviceUpdateUser(idVerify, propsToChange)
        if (!updatedUser) {
            return res.send(Errors)
        }
        return res.send(updatedUser)
    }
}

export async function deleteUser(req: Request, res: Response) { // כאן הבאתי יוזר ניים מהפרמס
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

export async function follow(req: Request, res: Response) { // using graph QL: (mutation, query, subscribtion, execution). not CRUD
    const isValidId = validatyeIdLength(req.id?.toHexString())
    if (!isValidId) {
        return
    }
    const userToFollow = Object.entries(req.body)
    const id = userToFollow[0][0]
    const value: string = userToFollow[0][1]
    if (id !== 'id') {
        return
    }
    if (!validatyeIdLength(value)) {
        return
    }
    const updatedUser = await serviceFollow(req.id, value)
    return res.send(updatedUser)
}

export async function unFollow(req: Request, res: Response) {
    const isValidId = validatyeIdLength(req.id?.toHexString())
    if (!isValidId) {
        return
    }
    const userToUnFollow = Object.entries(req.body)
    const id = userToUnFollow[0][0]
    const value = userToUnFollow[0][1]
    if (id !== 'id') {
        return
    }
    if (!validatyeIdLength(value)) {
        return
    }
    const updateUser = await serviceUnFollow(req.id, value)
    return res.send(updateUser)
}
