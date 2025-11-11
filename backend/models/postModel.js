const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String, // This will be the URL from Cloudinary
  },
  cloudinaryPublicId: {
    type: String, // This is for deleting the image from Cloudinary
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // <-- THIS IS THE IMPORTANT CHANGE
    },
  ],
  comments: [commentSchema],
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Validate that either text or imageUrl exists
postSchema.pre('validate', function(next) {
  if (!this.text && !this.imageUrl) {
    next(new Error('Post must contain either text or an image'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Post', postSchema);