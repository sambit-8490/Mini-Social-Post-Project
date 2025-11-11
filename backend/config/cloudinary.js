const { v2: cloudinary } = require('cloudinary');
const DatauriParser = require('datauri/parser');
const path = require('path');

const parser = new DatauriParser();

/**
 * Converts a buffer to a Data URI
 * @param {object} req - Express request object, must contain req.file
 * @returns {string} - A Data URI string
 */
const bufferToDataUri = (req) => {
  return parser.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  ).content;
};

/**
 * Uploads a file buffer to Cloudinary
 * @param {object} req - Express request object
 * @returns {Promise<object>} - A promise that resolves with the Cloudinary upload result
 */
const uploadToCloudinary = (req) => {
  const file = bufferToDataUri(req);
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, {
      folder: 'mini-social-app', // Optional: creates a folder in Cloudinary
      resource_type: 'auto',
    }, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

/**
 * Deletes a file from Cloudinary
 * @param {string} publicId - The public_id of the file to delete
 * @returns {Promise<object>} - A promise that resolves with the Cloudinary deletion result
 */
const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};


module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};