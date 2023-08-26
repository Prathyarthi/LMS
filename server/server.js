const app = require('./app');
require('dotenv').config();
const connectToDb = require('./config/dbConfig');

const PORT = process.env.PORT || 8002;

app.listen(PORT, async () => {
    await connectToDb();
    console.log(`Server running at ${PORT}`);
})