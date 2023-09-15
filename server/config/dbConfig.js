import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
// const MONGO_URL = process.env.MONGO_URL;

mongoose.set('strictQuery', false);  // By making strictQuery as false  we are basically telling the compiler to not throw an error  if the requested fiels is not present

// const connectToDb = async () => {
//     try {
//         const { conn } = await mongoose.connect(
//             process.env.MONGO_URL
//         );

//         if (conn) {
//             console.log(`Connected to DB ${conn.host}`)
//         }
//     } catch (e) {
//         console.log(e);
//         process.exit(1);  // To Kill
//     }
// }

const connectToDb = () => {
    mongoose
        .connect(process.env.MONGO_URL)
        .then((conn) => console.log(`connected to DB: ${conn.connection.host}`))
        .catch((err) => console.log(err.message));
};

export default connectToDb;