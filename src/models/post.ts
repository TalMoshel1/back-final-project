import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({ // value's first letter must be a capital letter
    author: {type: String, ref:"User", required: true, index: true},
    body: { type: String, required: true, validate: (value) => { value.length > 0 } },
    likes: { type: Number, default: 0},
    caption: {type: String},
    comments: {type: JSON},
    mediaList: {type: []}, // why is saves the image url like that : uploads\\1664182176402-DoReMi.jpg ( two \\) 
    created: { type: Date, default: Date.now }

})

export const PostModel = mongoose.model('Post', PostSchema) // you have to put a capital letter in the first parameter




