const mongoose = require('mongoose');

mongoose.set('strictQuery', false);  // By making strictQuery as false  we are basically telling the comipiler to not throw an error  if the requested fiels is not present

const connectToDb = async () => {
    try {
        const { conn } = await mongoose.connect(
            process.env.MONGO_URL
        );

        if (conn) {
            console.log(`Connected to DB ${conn.connection.host}`)
        }
    } catch (e) {
        console.log(e);
        process.exit(1);  // To Kill
    }
}
module.exports = connectToDb;