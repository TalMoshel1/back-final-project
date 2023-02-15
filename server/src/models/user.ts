import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

type User = {
    
}


const UserSchema = new mongoose.Schema({ // value's first letter must be a capital letter
    // firstName: { type: String, required: true, validate: (value: string) => { !value.includes('-') } },
    // lastName: { type: String, required: true, validate: (value: string) => { !value.includes('-') } },
    fullname: {type: String, required: true, validate: (value: string) => { !value.includes(' ') }},
    created: { type: Date, default: Date.now },
    following: {type: Array, default: [] },
    username: { type: String, required: true, valIdate: (value: string) => { !(value.length < 4) }, unique: true },
    password: { type: String, required: true },
    email: {
        type: String, validate: (value: string) => { value.includes('@') }
    },
    tokenCreatedAt: {type: Number, default: "" },
    media: {type: String, default: ""}
    
})

UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    }
    catch (error) {
        console.log(error)
    }
})



export const UserModel = mongoose.model('User', UserSchema) // you have to put a capital letter in the first parameter