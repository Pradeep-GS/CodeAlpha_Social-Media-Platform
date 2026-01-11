const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'social_media/posts',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1080, crop: 'limit' }]
  }
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'social_media/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 400, height: 400, crop: 'thumb' }],
  },
});

const uploadProfile = multer({ storage: profileStorage });
const uploadPost = multer({ storage: postStorage });

module.exports = { uploadPost, uploadProfile };