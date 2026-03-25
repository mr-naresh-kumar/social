const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Create Post
router.post('/', [auth, upload.single('image')], async (req, res) => {
    const { text } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    if (!text && !image) {
        return res.status(400).json({ message: 'Post must have text or an image' });
    }

    try {
        const newPost = new Post({
            user: req.user.id,
            username: req.user.username,
            text,
            image
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get Feed
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Like/Unlike Post
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(req.user.username)) {
            post.likes = post.likes.filter(u => u !== req.user.username);
        } else {
            post.likes.push(req.user.username);
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Comment on Post
router.post('/comment/:id', auth, async (req, res) => {
    const { text } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const newComment = {
            username: req.user.username,
            text
        };

        post.comments.push(newComment);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Share Post (increment count)
router.put('/share/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.shares = (post.shares || 0) + 1;
        await post.save();
        console.log(`Post ${post._id} shared. New share count: ${post.shares}`);
        res.json(post);
    } catch (err) {
        console.error('Share update error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});
// Get user posts
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete Post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check user ownership
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
