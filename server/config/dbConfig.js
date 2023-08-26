const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL

mongoose.set('strictQuery', false);  // By making strictQuery as false  we are basically telling the compiler to not throw an error  if the requested fiels is not present

// const connectToDb = async () => {
// try {
//     const { conn } = await mongoose.connect(
//         process.env.MONGO_URL
//     );

//     if (conn) {
//         console.log(`Connected to DB ${conn.connection.host}`)
//     }
// } catch (e) {
//     console.log(e);
//     process.exit(1);  // To Kill
// }

// }
const connectToDb = () => {
    mongoose
        .connect(MONGO_URL)
        .then((conn) => console.log(`connected to DB: ${conn.connection.host}`))
        .catch((err) => console.log(err.message));
};

module.exports = connectToDb;