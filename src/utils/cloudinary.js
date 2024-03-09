import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { fileURLToPath } from "url";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.COUDINARY_API_SCRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(fileURLToPath, {
      resource_type: "auto",
    });
    //file has been uploaded successfull
    console.log("file is uploaded on cloudinary: ", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation got fail
  }
};

/* 
cloudinary.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" },
  function (error, result) {
    console.log(result);
  }
);
*/
