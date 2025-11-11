import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import PostSkeleton from '../components/PostSkeleton';
import { Box, Typography, Alert, Button } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const POSTS_PER_PAGE = 5;

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (currentPage) => {
    if (currentPage === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError('');

    try {
      const res = await axios.get(
        `${API_URL}/posts?page=${currentPage}&limit=${POSTS_PER_PAGE}`
      );
      
      const { data, pagination } = res.data;

      setPosts((prevPosts) => 
        currentPage === 1 ? data : [...prevPosts, ...data]
      );
      
      setHasMore(pagination.page < pagination.totalPages);
      setPage(currentPage + 1);

    } catch (err) {
      console.error('Failed to fetch posts', err);
      setError('Failed to load feed. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  // --- NEW HANDLER ---
  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) => 
      prevPosts.filter((post) => post._id !== deletedPostId)
    );
  };
  // -------------------

  const handleLoadMore = () => {
    fetchPosts(page);
  };

  return (
    <Box>
      {user && <CreatePost onPostCreated={handlePostCreated} />}
      
      {loading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && posts.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No posts yet. Be the first to post!
        </Typography>
      )}

      <Box mt={2} component="div">
        {posts.map((post) => (
          <Post 
            key={post._id} 
            post={post} 
            onPostUpdated={handlePostUpdated}
            onPostDeleted={handlePostDeleted} // <-- Pass new handler
          />
        ))}
      </Box>

      {!loading && hasMore && (
        <Box textAlign="center" mt={3}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}

      {!loading && !hasMore && posts.length > 0 && (
         <Typography variant="body2" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          You've reached the end of the feed.
        </Typography>
      )}
    </Box>
  );
};

export default HomePage;