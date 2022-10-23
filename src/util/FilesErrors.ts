import { Errors } from '../util/PostsErrors'

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

export function getFileErrors(file: {}) {
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
    
}