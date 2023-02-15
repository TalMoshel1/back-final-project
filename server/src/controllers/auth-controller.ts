import verifyUser from '../middlewares/verify-user';
import { verify, sign } from 'jsonwebtoken'
import { getUserByUsername, getUserByUsernameAndPassword, createUser, updateTokenTimeOfUserDB, getTokenAndOptions } from '../services/auth-service';
import bcrypt from 'bcrypt'
import { cookieParser, cookie } from 'cookie-parser'
import { Errors } from '../util/UserErrors';
import { validateBodyUser } from './users-controller'

function validateBodyLogin(obj: Record<string, string>) {
    const { username, password } = obj
    if (!(username && password)) {
        return [Errors.provideValue]
    }
    const props = Object.entries(obj)
    const errors = props.reduce((errorsList: object[], pair: string[]) => {
        const field: string = pair[0]
        const value = pair[1]
        if (field !== 'username' && field !== 'password') {
            errorsList.push(Errors.invalidProp)
        }
        if (field === 'username') {
            if (value.length <= 4) {
                errorsList.push(Errors.usernameLength)
            }
            if (!value) {
                errorsList.push(Errors.provideValue)
            }
        }
        if (field === 'password') {
            if (value.length < 8) {
                errorsList.push(Errors.password)
            }
            if (!value) {
                errorsList.push(Errors.provideValue)
            }
        }
        return errorsList
    }, [])
    return errors
}

export async function loginNoAuth(req, res) {
    const errors = validateBodyLogin(req.body)
    if (errors.length === 1) {
        res.status(403).send([errors])
        return
    } else if (errors.length) {
        res.status(403).send([errors])
        return
    }
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) {
        res.status(403).send([Errors.userNotExists])
        return
    }
    const arePasswordsEquals = await bcrypt.compare(password, user.password)
    if (!arePasswordsEquals) {
        res.status(401).send([Errors.wrongPassword])
        return
    }
    return user
}

export async function login(req, res) {
    const errors = validateBodyLogin(req.body)
    if (errors.length === 1) {
        res.status(403).send([errors])
        return
    } else if (errors.length) {
        console.log('all errors : ',errors)
        res.status(403).send([errors])
        return
    }
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) {
        res.status(403).send([Errors.userNotExists])
        return
    }
    const arePasswordsEquals = await bcrypt.compare(password, user.password)
    if (!arePasswordsEquals) {
        res.status(401).send([Errors.wrongPassword])
        return
    }
    const tokenDate = new Date().getTime()
    await updateTokenTimeOfUserDB(user._id, tokenDate)
    const tokenAndOptions = await getTokenAndOptions(user._id, tokenDate)
    res.cookie('cookieInsta', tokenAndOptions.token, tokenAndOptions.options)
    return res.send(user.username)
}


export async function register(req, res) {
    const { email, username, password, fullname } = req.body
    if (!(email && username && password && fullname)) {
        return res.status(403).send([Errors.missedFields])

    }
    const errors = validateBodyUser(req.body)
    if (errors.length === 1) {
        return res.status(403).send(errors)
    } else if (errors.length) {
        return res.status(403).send(errors)
    }
    const user = await getUserByUsername(username);
    if (user) {
        return res.status(403).send([Errors.usernameExists])
    }
    try {
        const newUser = await createUser(req.body);
        const { username } = newUser
        return res.send('welcome ' + username)
    }
    catch {
        res.status(400)
    }
}


export async function logout(req, res) {
    return res.clearCookie
}