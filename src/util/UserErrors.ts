import {createError} from './Errors'

const password = createError("password must contains 8 characters long")
const usernameLength = createError("please provide a username with more then 4 characters")
const usernameExists = createError("username already exists")
const email = createError("email must contains '@'")
const fullname = createError("fullname must contains at least one space")
const invalidProp = createError("the prop you trying to excess does'nt exists")
const wrongPassword = createError("wrong password")
const noToken = createError("you dont have token")
const missedFields = createError("Fields are missed")
const userDoesntExists = createError('user doesnt exists')
const provideValue = createError('provide value')
const userNotExists = createError("username is not exists")


export const Errors = {
    password,
    usernameLength,
    email,
    fullname,
    invalidProp,
    usernameExists,
    wrongPassword,
    noToken,
    missedFields,
    userDoesntExists,
    provideValue,
    userNotExists
}

