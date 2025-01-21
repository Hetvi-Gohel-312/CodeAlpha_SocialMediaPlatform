const express = require('express');
const router = express.Router();

let users = []; // In-memory "database" for demo purposes

// Signup route
router.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Add new user to the in-memory array
  users.push({ email, password });
  res.status(201).json({ message: 'User signed up successfully' });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = users.find(user => user.email === email);

  if (!user || user.password !== password) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful' });
});

// Route to fetch all posts
router.get('/posts', (req, res) => {
  // You can add filtering logic here to return posts specific to the logged-in user
  res.json({ posts });
});

// Route to create a new post
router.post('/create-post', (req, res) => {
  const { userAvatar, username, content, imagePath } = req.body;

  // Add post to in-memory array (you can later connect it to a real database)
  const newPost = { userAvatar, username, content, imagePath };
  posts.push(newPost);

  res.status(201).json({ message: 'Post created successfully' });
});

module.exports = router; // Export the routes
