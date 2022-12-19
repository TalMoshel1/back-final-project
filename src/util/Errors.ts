export const createError = (msg: string) => {
    return { 
        message: msg
    }
}

const FailedLoginError = createError("failed to loging, one of your credentials is wrong please try again.")


export const Errors = {
    FailedLoginError
}