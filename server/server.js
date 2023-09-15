import app from './app.js';
import { config } from 'dotenv';
config();
import connectToDb from './config/dbConfig.js';
import cloudinary from 'cloudinary';

const PORT = process.env.PORT || 8002;

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
    API_KEY: process.env.API_KEY,
})

app.listen(PORT, async () => {
    await connectToDb();
    console.log(`Server running at ${PORT}`);
})