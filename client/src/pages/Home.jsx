import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Tabs, Tab } from '@mui/material';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const getFilteredPosts = () => {
    let filtered = [...posts];
    if (tabIndex === 1) { // For You (Shuffle)
      return filtered.sort(() => Math.random() - 0.5);
    }
    if (tabIndex === 2) { // Most Liked
      return filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    }
    return filtered;
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <CreatePost onPostCreated={handlePostCreated} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} aria-label="feed tabs">
          <Tab label="All Post" />
          <Tab label="For You" />
          <Tab label="Most Liked" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>
        {filteredPosts.map(post => (
          <PostCard key={post._id} post={post} onDelete={handleDelete} />
        ))}
      </Box>
    </Container>
  );
};

export default Home;
