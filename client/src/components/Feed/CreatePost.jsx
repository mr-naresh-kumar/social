import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Box, IconButton, Avatar, Typography, Popover } from '@mui/material';
import { PhotoCamera, SentimentSatisfiedAlt, FormatListBulleted } from '@mui/icons-material';
import axios from 'axios';

const commonEmojis = ['😊', '😂', '❤️', '👍', '🔥', '✨', '🙌', '🎉', '😎', '😢', '😍', '🤔'];

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleEmojiClick = (emoji) => {
    setText(prev => prev + emoji);
    setEmojiAnchor(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!text && !image) return;

    const formData = new FormData();
    formData.append('text', text);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      setText('');
      setImage(null);
      setPreview('');
      onPostCreated(response.data);
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          Create Post
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
          <Avatar src={user?.profilePicture} />
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="standard"
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ mt: 1 }}
          />
        </Box>
        {preview && (
          <Box sx={{ mt: 2, position: 'relative' }}>
            <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: 8, maxHeight: 300, objectFit: 'cover' }} />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
          <Box>
            <IconButton component="label">
              <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              <PhotoCamera color="primary" />
            </IconButton>
            <IconButton onClick={(e) => setEmojiAnchor(e.currentTarget)}>
              <SentimentSatisfiedAlt sx={{ color: '#ffc107' }} />
            </IconButton>
            <Popover
              open={Boolean(emojiAnchor)}
              anchorEl={emojiAnchor}
              onClose={() => setEmojiAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                {commonEmojis.map(emoji => (
                  <IconButton key={emoji} onClick={() => handleEmojiClick(emoji)} size="small">
                    {emoji}
                  </IconButton>
                ))}
              </Box>
            </Popover>
            <IconButton><FormatListBulleted sx={{ color: '#4caf50' }} /></IconButton>
          </Box>
          <Button
            variant="contained"
            disabled={!text && !image}
            onClick={handleSubmit}
            sx={{ px: 4, borderRadius: 5 }}
            startIcon={<PhotoCamera sx={{ transform: 'rotate(180deg)' }} />}
          >
            Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
