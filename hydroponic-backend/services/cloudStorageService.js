const cloudinary = require("cloudinary").v2;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const uploadImageBuffer = (fileBuffer, folder = "hydroponic-platform") =>
  new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return reject(new Error("Cloudinary is not configured"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });

module.exports = {
  uploadImageBuffer
};
