// const mongoose = require('mongoose');
import mongoose from 'mongoose'
// const connection = mongoose.connect(process.env.MONGO_URL!
//   , {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
//   );

export async function connectTodb() {
  try {
    await mongoose.connect('mongodb+srv://eilontal:eilontal@final-project-backend.trmjkco.mongodb.net/?retryWrites=true&w=majority');
    console.log('connected to db')

  } catch (error) {
    // throw new Error('could not connect')
    return Promise.reject(new Error('could not connect'))
  }
}

