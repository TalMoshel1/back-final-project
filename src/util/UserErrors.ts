import {createError} from './Errors'

const password = createError("password must contains 8 characters long")
const usernameLength = createError("please provide a username with at least 4 characters")
const usernameExists = createError("username already exists")
const email = createError("email must contains '@'")
const fullname = createError("fullname must contains at least one space")
const invalidProp = createError("the prop you trying to excess does'nt exists")
const FailedLoginError = createError("failed to loging, one of your credentials is wrong please try again.")
const noToken = createError("you dont have token")
const missedFields = createError("Fields are missed")
const userDoesntExists = createError('user doesnt exists')



export const Errors = {
    password,
    usernameLength,
    email,
    fullname,
    invalidProp,
    usernameExists,
    FailedLoginError,
    noToken,
    missedFields,
    userDoesntExists
}

