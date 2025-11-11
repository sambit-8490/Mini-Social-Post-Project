import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Typography,
  Alert,
  CircularProgress,
  Input,
  IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ClearIcon from '@mui/icons-material/Clear';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null); // For image preview
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 5MB limit check
      if (file.size > 5 * 1024 * 1024) {
        setError('File is too large. Max 5MB allowed.');
        return;
      }
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setError(''); // Clear file size error
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text && !imageFile) {
      setError('Please enter text or upload an image');
      return;
    }

    setLoading(true);
    
    // Use FormData for multipart file upload
    const formData = new FormData();
    formData.append('text', text);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      // Auth token is global, Axios handles FormData content-type
      const res = await axios.post(`${API_URL}/posts`, formData);
      
      onPostCreated(res.data.data);
      setText('');
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || 'Failed to create post. Please try again.';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography fontWeight="bold">{user.username}</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="What's on your mind?"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loading}
          />
          
          {/* Hidden file input */}
          <Input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            sx={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              disabled={loading}
              startIcon={<PhotoCamera />}
            >
              Upload Image
            </Button>
          </label>

          {/* Image Preview */}
          {preview && (
            <Box sx={{ mt: 2, position: 'relative', maxWidth: '300px' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />
              <IconButton
                size="small"
                onClick={clearImage}
                disabled={loading}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                }}
              >
                <ClearIcon />
              </IconButton>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || (!text && !imageFile)}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;