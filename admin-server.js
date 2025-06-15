const express = require('express');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Octokit } = require("@octokit/rest"); // npm install @octokit/rest
require('dotenv').config();

const app = express();
const PORT = 4000;

// --- CONFIGURE --- //
// Replace these with your own values or use .env
const ADMIN_USERNAME = process.env.ADMIN_USERNAME // || "admin";        // <-- REPLACE with your admin username
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD // || "password123";  // <-- REPLACE with your admin password

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;       // <-- REPLACE with your GitHub personal access token
const GITHUB_OWNER = process.env.GITHUB_OWNER;       // <-- REPLACE with your GitHub username (e.g., "mattkim838")
const GITHUB_REPO = process.env.GITHUB_REPO;         // <-- REPLACE with your repository name (e.g., "moons-house")
const GITHUB_PHOTO_PATH = "public/photos";           // <-- Keeps uploaded photos in /public/photos

const octokit = GITHUB_TOKEN ? new Octokit({ auth: GITHUB_TOKEN }) : null;

// --- MIDDLEWARE --- //
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET // || "supersecret", // <-- REPLACE with a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
}));
app.use(express.static(path.join(__dirname)));

// --- AUTH --- //
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    res.status(401).json({ success: false, message: "Unauthorized" });
}

// --- LOGIN --- //
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.user = username;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});
app.post('/api/logout', (req, res) => {
    req.session.destroy(() => res.json({ success: true }));
});

// --- UPLOAD --- //
const upload = multer({ dest: 'uploads/' });
app.post('/api/upload', isAuthenticated, upload.array('photos'), async (req, res) => {
    if (!req.files || !req.files.length) return res.json({ success: false, message: "No files uploaded." });

    let results = [];
    for (let file of req.files) {
        const ext = path.extname(file.originalname);
        const newName = Date.now() + "-" + file.originalname.replace(/\s+/g, '_');
        const targetPath = path.join(__dirname, 'uploads', newName);
        fs.renameSync(file.path, targetPath);

        // Push to GitHub repo
        if (octokit && GITHUB_OWNER && GITHUB_REPO) {
            try {
                const content = fs.readFileSync(targetPath, { encoding: 'base64' });
                const githubFilePath = `${GITHUB_PHOTO_PATH}/${newName}`;
                await octokit.repos.createOrUpdateFileContents({
                    owner: GITHUB_OWNER,
                    repo: GITHUB_REPO,
                    path: githubFilePath,
                    message: `Add photo ${newName}`,
                    content,
                    committer: { name: "Photo Uploader Bot", email: "bot@yourdomain.com" },
                    author: { name: req.session.user, email: "admin@yourdomain.com" }
                });
                results.push(`${file.originalname} uploaded to GitHub`);
                fs.unlinkSync(targetPath);
            } catch (e) {
                results.push(`${file.originalname} error: ${e.message}`);
            }
        } else {
            results.push(`${file.originalname} uploaded locally (no GitHub config)`);
        }
    }
    res.json({ success: true, message: results.join("\n") });
});

// --- SERVER --- //
app.listen(PORT, () => {
    console.log(`Admin panel running at http://localhost:${PORT}`);
});