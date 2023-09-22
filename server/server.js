import app from './app.js';
import { config } from 'dotenv';
config();
import connectToDb from './config/dbConfig.js';
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';

const PORT = process.env.PORT || 8002;

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
    api_key: process.env.API_KEY
})

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
})

app.listen(PORT, async () => {
    await connectToDb();
    console.log(`Server running at ${PORT}`);
})