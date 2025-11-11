import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LikeModal from './LikeModal'; // <-- Import LikeModal
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Collapse,
  CircularProgress,
  Menu, // <-- For delete confirmation
  MenuItem, // <-- For delete confirmation
  Dialog, // <-- For delete confirmation
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Send,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon, // <-- For delete menu
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Post = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [likeModalOpen, setLikeModalOpen] = useState(false); // <-- State for LikeModal
  
  // --- States for Delete ---
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // -------------------------

  const isLiked = user && post.likes.includes(user.id);
  const isOwner = user && user.id === post.user._id;

  // --- Like Handlers ---
  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await axios.put(`${API_URL}/posts/${post._id}/like`);
      const updatedPost = { ...post, likes: res.data.data };
      onPostUpdated(updatedPost);
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const handleOpenLikeModal = () => {
    if (post.likes.length > 0) {
      setLikeModalOpen(true);
    }
  };

  // --- Comment Handlers ---
  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    setLoadingComment(true);
    try {
      const res = await axios.post(`${API_URL}/posts/${post._id}/comment`, { text: comment });
      const updatedPost = { ...post, comments: res.data.data };
      onPostUpdated(updatedPost);
      setComment('');
      setCommentsExpanded(true);
    } catch (err) {
      console.error('Failed to comment', err);
    } finally {
      setLoadingComment(false);
    }
  };

  // --- Delete Handlers ---
  const handleMenuOpen = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);
  const openDeleteConfirm = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };
  const closeDeleteConfirm = () => setDeleteConfirmOpen(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/posts/${post._id}`);
      onPostDeleted(post._id); // Notify HomePage to remove post
      // No need to close dialog, it's gone
    } catch (err) {
      console.error('Failed to delete post', err);
      setDeleting(false);
      closeDeleteConfirm();
    }
  };
  // -------------------------

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {post.user.username.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={<Typography fontWeight="bold">{post.user.username}</Typography>}
          subheader={format(new Date(post.createdAt), 'MMMM d, yyyy h:mm a')}
          action={
            isOwner && (
              <IconButton onClick={handleMenuOpen} aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            )
          }
        />
        {/* Menu for Delete Button */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={openDeleteConfirm} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} /> Delete Post
          </MenuItem>
        </Menu>

        <CardContent>
          {post.text && <Typography variant="body1" paragraph>{post.text}</Typography>}
          {post.imageUrl && (
            <Box sx={{ my: 2, textAlign: 'center' }}>
              <img
                src={post.imageUrl}
                alt="Post content"
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '8px' }}
              />
            </Box>
          )}
        </CardContent>
        <Divider />
        <CardActions disableSpacing sx={{ justifyContent: 'space-between', p: 1 }}>
          <Box>
            <IconButton onClick={handleLike} disabled={!user}>
              {isLiked ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder />}
            </IconButton>
            <Button
              size="small"
              onClick={handleOpenLikeModal}
              sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 'bold' }}
            >
              {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
            </Button>
          </Box>
          <Button
            onClick={() => setCommentsExpanded(!commentsExpanded)}
            aria-expanded={commentsExpanded}
            aria-label="show comments"
            startIcon={<ChatBubbleOutline />}
            endIcon={<ExpandMoreIcon sx={{
              transform: commentsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}/>}
          >
            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
          </Button>
        </CardActions>
        <Divider />

        <Collapse in={commentsExpanded} timeout="auto" unmountOnExit>
          <Box p={2}>
            <List dense>
              {post.comments.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                  No comments yet.
                </Typography>
              )}
              {post.comments.map((c) => (
                <ListItem key={c._id} alignItems="flex-start">
                  <ListItemAvatar sx={{ minWidth: '40px' }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {c.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography fontWeight="bold" component="span" variant="body2">{c.username}</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">{c.text}</Typography>}
                  />
                </ListItem>
              ))}
            </List>

            {user && (
              <Box component="form" onSubmit={handleComment} display="flex" mt={2}>
                <TextField
                  label="Add a comment..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={loadingComment}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ ml: 1, minWidth: '80px' }}
                  disabled={loadingComment || !comment.trim()}
                >
                  {loadingComment ? <CircularProgress size={24} color="inherit" /> : <Send />}
                </Button>
              </Box>
            )}
          </Box>
        </Collapse>
      </Card>

      {/* Like Modal */}
      <LikeModal
        open={likeModalOpen}
        onClose={() => setLikeModalOpen(false)}
        postId={post._id}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
      >
        <DialogTitle>Delete Post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Are you sure you want to permanently
            delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm} disabled={deleting}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Post;