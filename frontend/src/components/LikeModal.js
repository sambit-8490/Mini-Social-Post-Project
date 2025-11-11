import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  IconButton,
}
from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Style for the modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const LikeModal = ({ open, onClose, postId }) => {
  const [likers, setLikers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikers = async () => {
      if (!postId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/posts/${postId}/likes`);
        setLikers(res.data.data);
      } catch (err) {
        console.error('Failed to fetch likes', err);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchLikers();
    } else {
      // Clear list when modal closes
      setLikers([]);
    }
  }, [open, postId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Liked by
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List dense>
            {likers.length === 0 ? (
              <Typography sx={{ textAlign: 'center', my: 2 }}>
                No likes yet.
              </Typography>
            ) : (
              likers.map((user) => (
                <ListItem key={user._id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.username} />
                </ListItem>
              ))
            )}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default LikeModal;