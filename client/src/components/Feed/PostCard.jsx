import React, { useState } from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, Typography, IconButton, Box, TextField, List, ListItem, ListItemText, Menu, MenuItem } from '@mui/material';
import { Favorite, FavoriteBorder, ChatBubbleOutline, Share, MoreVert } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PostCard = ({ post, onDelete }) => {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [shares, setShares] = useState(post.shares || 0);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    handleMenuClose();
    if (onDelete) onDelete(post._id);
  };

  const handleLike = async () => {
    try {
      const response = await axios.put(`/api/posts/like/${post._id}`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setLikes(response.data.likes);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (e) => {
    if (e.key === 'Enter' && commentText) {
      try {
        const response = await axios.post(`/api/posts/comment/${post._id}`, { text: commentText }, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setComments(response.data.comments);
        setCommentText('');
      } catch (err) {
        console.error('Error commenting:', err);
      }
    }
  };
  const handleShare = async () => {
    const shareData = {
      title: 'Social App Post',
      text: post.text,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        // If we reach here, share was successful (or at least handed off)
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }

      // Only update count if share didn't throw (e.g. AbortError on cancel)
      const response = await axios.put(`/api/posts/share/${post._id}`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setShares(response.data.shares);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const isLiked = likes.includes(user?.username);

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={
          <IconButton component={Link} to={`/profile/${post.user}`} sx={{ p: 0 }}>
            <Avatar src={post.avatar} sx={{ bgcolor: 'primary.light' }}>{post.username[0].toUpperCase()}</Avatar>
          </IconButton>
        }
        action={
          <IconButton aria-label="settings" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        }
        title={
          <Typography 
            component={Link} 
            to={`/profile/${post.user}`} 
            variant="subtitle1" 
            fontWeight="700" 
            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
          >
            {post.username}
          </Typography>
        }
        subheader={<Typography variant="caption" color="text.secondary">{new Date(post.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })}</Typography>}
      />
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {user?.id === post.user && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete Post</MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>Report</MenuItem>
        <MenuItem onClick={handleMenuClose}>Copy Link</MenuItem>
      </Menu>
      {post.text && (
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        </CardContent>
      )}
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post image"
          sx={{ maxHeight: 500, objectFit: 'contain', bgcolor: '#f5f7f9' }}
        />
      )}
      <CardActions sx={{ px: 2, py: 1, borderTop: '1px solid #f0f2f5', justifyContent: 'space-around' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#65676b' }}>
          <IconButton onClick={handleLike} size="small" sx={{ color: isLiked ? 'error.main' : 'inherit' }}>
            {isLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2" fontWeight="600">{likes.length}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#65676b' }}>
          <IconButton onClick={() => setShowComments(!showComments)} size="small">
            <ChatBubbleOutline />
          </IconButton>
          <Typography variant="body2" fontWeight="600">{comments.length}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#65676b', cursor: 'pointer' }} onClick={handleShare}>
          <IconButton size="small"><Share /></IconButton>
          <Typography variant="body2" fontWeight="600">{shares}</Typography>
        </Box>
      </CardActions>
      {showComments && (
        <Box sx={{ px: 2, pb: 2 }}>
          <List dense>
            {comments.map((c, i) => (
              <ListItem key={i} sx={{ px: 0 }}>
                <ListItemText
                  primary={<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{c.username}</Typography>}
                  secondary={c.text}
                />
              </ListItem>
            ))}
          </List>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={handleComment}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </Box>
      )}
    </Card>
  );
};

export default PostCard;
