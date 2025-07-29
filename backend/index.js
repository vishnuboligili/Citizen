require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');


const connectDB = require('./config/db');
const sessionConfig = require('./config/session'); // ✅ Modular session
const transporter = require('./config/nodemail'); // ✅ Correct path
const userIssue=require('./routes/userIssues');
// const authRoutes=require('./routes/authRoutes');
const authRoutes=require('./routes/authRoutes')
const adminIssue=require('./routes/adminIssues');
// const workerIssues=require('./routes/workerIssues');
const workerIssues=require('./routes/workerIssues');
const app = express();
app.use(express.json());

const port = process.env.PORT || 4000;

// DB connection
connectDB();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(sessionConfig); // ✅ Using modular session config

// Static images
const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/images', express.static(uploadDir));

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }
  res.json({
    success: true,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Routes
app.use('/', authRoutes); // ✅ Plug in routes

app.use('/user', userIssue); // ✅ Registering /user/issue route here

app.use('/admin',adminIssue);

app.use('/worker',workerIssues);
// Default route
app.get("/", (req, res) => {
  res.send("✅ Express backend is running");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
