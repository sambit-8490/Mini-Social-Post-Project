const Post = require('../models/postModel');
const { body } = require('express-validator');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// --- Validation Rules ---

exports.createPostValidationRules = () => {
  return [
    // Custom validation: check for text OR file
    body().custom((value, { req }) => {
      if (!req.body.text && !req.file) {
        throw new Error('Post must contain either text or an image');
      }
      return true;
    }),
    body('text', 'Text must be a string').optional().isString(),
  ];
};

exports.commentValidationRules = () => {
  return [
    body('text', 'Comment text cannot be empty').notEmpty(),
  ];
};


// --- Controller Functions ---

/**
 * @desc    Get all posts with pagination
 * @route   GET /api/posts
 * @access  Public
 */
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .populate('user', 'username') // Populate post author
      .populate('comments.user', 'username') // Populate comment authors
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
      },
      data: posts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create new post (with image upload)
 * @route   POST /api/posts
 * @access  Private
 */
exports.createPost = async (req, res) => {
  const { text } = req.body;
  let imageUrl = '';
  let cloudinaryPublicId = '';

  try {
    // 1. Check if a file was uploaded
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req);
      imageUrl = uploadResult.secure_url;
      cloudinaryPublicId = uploadResult.public_id;
    } else if (!text) {
      // This is a redundant check, validation middleware should catch it
      return res.status(400).json({ success: false, errors: [{ msg: 'Post must have text or an image' }] });
    }

    // 2. Create post in database
    const post = await Post.create({
      text,
      imageUrl,
      cloudinaryPublicId,
      user: req.user.id,
    });

    // 3. Populate user data for immediate frontend display
    const newPost = await Post.findById(post._id).populate('user', 'username');

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    console.error(err.message);
    // If error, try to delete uploaded image from Cloudinary
    if (cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(cloudinaryPublicId);
      } catch (cloudinaryErr) {
        console.error('Cloudinary cleanup failed', cloudinaryErr);
      }
    }
    res.status(500).json({ success: false, message: 'Server error creating post' });
  }
};

/**
 * @desc    Like/Unlike a post
 * @route   PUT /api/posts/:id/like
 * @access  Private
 */
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if post already liked by user
    // We must compare strings, as IDs are objects
    const likedIndex = post.likes.findIndex(
      (userId) => userId.toString() === req.user.id.toString()
    );

    if (likedIndex > -1) {
      // Unlike
      post.likes.splice(likedIndex, 1);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();
    
    // Return the new likes array
    res.status(200).json({ success: true, data: post.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Comment on a post
 * @route   POST /api/posts/:id/comment
 * @access  Private
 */
exports.commentOnPost = async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    const newComment = {
      user: req.user.id,
      username: req.user.username,
      text: text,
    };
    post.comments.push(newComment);
    await post.save();
    await post.populate('comments.user', 'username');
    res.status(201).json({ success: true, data: post.comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if user is the owner
    if (post.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    // 1. Delete image from Cloudinary (if it exists)
    if (post.cloudinaryPublicId) {
      await deleteFromCloudinary(post.cloudinaryPublicId);
    }

    // 2. Delete post from database
    await post.deleteOne();

    res.status(200).json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


/**
 * @desc    Get users who liked a post
 * @route   GET /api/posts/:id/likes
 * @access  Public
 */
exports.getLikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('likes', 'username');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};