import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";

config();

const cloudName = process.env.COUNDINARY_NAME;
const cloudApiKey = process.env.COUNDINARY_API_KEY;
const cloudApiSec = process.env.COUNDINARY_API_SECRET;



cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSec,
});


export default cloudinary