import {createError} from './Errors'

const noFile = createError('a file must be uploaded to a post')
const fileFormat = createError('please upload a file with extention of jpeg or jpg')
const idLengthError = createError('id need to be 24 chars length')
const noBody = createError('pleaase add a body to your post')
const noToken = createError("you dont have token")
const invalidProp = createError("the prop you trying to excess does'nt exists")
const cantChangeOtherUserPost = createError("can change another user's post")
const postNotFound = createError("post not found")


export const Errors = {
    noFile,
    fileFormat,
    idLengthError,
    noBody,
    noToken,
    invalidProp,
    cantChangeOtherUserPost,
    postNotFound
}