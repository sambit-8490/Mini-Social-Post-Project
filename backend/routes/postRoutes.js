const express = require('express');
const {
  getAllPosts,
  createPost,
  likePost,
  commentOnPost,
  deletePost,
  getLikes,
  createPostValidationRules,
  commentValidationRules
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const upload = require('../middleware/uploadMiddleware'); // <-- Import multer

const router = express.Router();

router.route('/')
  .get(getAllPosts)
  .post(
    protect, 
    upload.single('image'), // <-- Add multer middleware for single file upload
    createPostValidationRules(), 
    handleValidationErrors, 
    createPost
  );

router.route('/:id')
  .delete(protect, deletePost); // <-- Add DELETE route

router.put('/:id/like', protect, likePost);
router.get('/:id/likes', getLikes); // <-- Add GET route for likes

router.post(
  '/:id/comment', 
  protect, 
  commentValidationRules(), 
  handleValidationErrors, 
  commentOnPost
);

module.exports = router;