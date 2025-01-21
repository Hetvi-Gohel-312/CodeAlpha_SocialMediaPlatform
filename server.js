const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const fs = require('fs');
const path = require('path');  // Add this for serving static files
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files like HTML, CSS, JS

// Ensure 'uploads/' directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Initialize SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Failed to connect to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Create the "users" table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`);
        // Create the "posts" table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            postContent TEXT,
            imagePath TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    }
});

// Serve signup page when visiting root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));  
});

// Signup route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    console.log(`Username: ${username}, Email: ${email}, Password: ${password}`);

    // Check if email already exists in the database
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (row) {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }

        // Insert new user into the database
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.run(query, [username, email, password], function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
            }

            console.log(`User with email: ${email} created successfully.`);
            return res.json({ success: true, message: 'Sign-up successful!' });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log(`Email: ${email}, Password: ${password}`);

    // Check if user exists in the database
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
        }

        if (row && row.password === password) {
            return res.json({ success: true, message: 'Login successful!' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }
    });
});

// Post route (uploading a file)
app.post('/create-post', upload.single('image'), (req, res) => {
    const { postContent, user_id } = req.body;

    console.log('Received post content:', postContent);
    console.log('Received user_id:', user_id);
    console.log('Received file:', req.file);

    if (!postContent || !user_id) {
        return res.status(400).json({ success: false, message: 'Post content and user ID are required.' });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image uploaded.' });
    }

    const imagePath = req.file.path;

    const query = 'INSERT INTO posts (user_id, postContent, imagePath) VALUES (?, ?, ?)';
    db.run(query, [user_id, postContent, imagePath], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        return res.json({
            success: true,
            message: 'Post created successfully!',
            data: { postContent, imagePath }
        });
    });
});

// Route to fetch all posts (home page)
app.get('/get-posts', (req, res) => {
    const query = 'SELECT * FROM posts ORDER BY created_at DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        // Modify the image path to match the static folder structure
        const posts = rows.map(post => ({
            ...post,
            imagePath: `http://localhost:3000/${post.imagePath}`
        }));

        res.json({ success: true, posts: posts });
    });
});

// Route to fetch posts for a specific user (profile page)
app.get('/get-profile-posts/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const query = 'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC';
    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        // Modify the image path to match the static folder structure
        const posts = rows.map(post => ({
            ...post,
            imagePath: `http://localhost:3000/${post.imagePath}`
        }));

        res.json({ success: true, posts: posts });
    });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
