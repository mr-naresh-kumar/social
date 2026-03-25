import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Avatar, Paper, Grid, Divider, CircularProgress } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/Feed/PostCard';

const Profile = () => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  
  const targetId = id || loggedInUser?.id;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Fetch user info
        const userRes = await axios.get(`/api/auth/user/${targetId}`);
        setProfileUser(userRes.data);

        // Fetch user posts
        const postsRes = await axios.get(`/api/posts/user/${targetId}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (targetId) fetchProfileData();
  }, [targetId]);

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

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  if (!profileUser) return <Typography align="center" sx={{ mt: 10 }}>User not found.</Typography>;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4, textAlign: 'center' }}>
        <Avatar 
          src={profileUser.profilePicture} 
          sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}
        >
          {profileUser.username[0].toUpperCase()}
        </Avatar>
        <Typography variant="h5" fontWeight="bold">{profileUser.username}</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>{profileUser.email}</Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <Typography variant="h5" fontWeight="800" color="primary">{posts.length}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Posts</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5" fontWeight="800" color="primary">{profileUser.followers?.length || 0}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Followers</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5" fontWeight="800" color="primary">{profileUser.following?.length || 0}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Following</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>My Posts</Typography>
      {posts.map(post => (
        <PostCard key={post._id} post={post} onDelete={handleDelete} />
      ))}
      {posts.length === 0 && (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
          You haven't posted anything yet. Go to home and share your first post!
        </Typography>
      )}
    </Container>
  );
};

export default Profile;
