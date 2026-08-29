const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|bmp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Metadata storage file (stored inside uploads directory to persist with Render disks)
const metadataFile = path.join(uploadsDir, 'metadata.json');

// Load metadata
function loadMetadata() {
  try {
    if (fs.existsSync(metadataFile)) {
      const data = fs.readFileSync(metadataFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading metadata:', error);
  }
  return {};
}

// Save metadata
function saveMetadata(metadata) {
  try {
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error('Error saving metadata:', error);
  }
}

// API Routes

// GET all images with metadata
app.get('/api/images', (req, res) => {
  try {
    const metadata = loadMetadata();

    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to read images directory' });
      }

      const baseUrl = req.protocol + '://' + req.get('host');

      const images = files
        .filter(file => /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file))
        .map(file => {
          const filePath = path.join(uploadsDir, file);
          const stats = fs.statSync(filePath);
          const meta = metadata[file] || {};

          return {
            filename: file,
            url: `${baseUrl}/uploads/${file}`,
            uploadDate: meta.uploadDate || stats.mtime,
            size: stats.size,
            title: meta.title || file.replace(/\.[^/.]+$/, ''),
            description: meta.description || '',
            category: meta.category || 'other'
          };
        })
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

      res.json(images);
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST upload image with metadata
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, category } = req.body;
    const metadata = loadMetadata();

    // Save metadata for this file
    metadata[req.file.filename] = {
      title: title || req.file.originalname,
      description: description || '',
      category: category || 'other',
      uploadDate: new Date().toISOString()
    };

    saveMetadata(metadata);

    const baseUrl = req.protocol + '://' + req.get('host');

    res.json({
      message: 'Image uploaded successfully',
      filename: req.file.filename,
      url: `${baseUrl}/uploads/${req.file.filename}`,
      metadata: metadata[req.file.filename]
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

// GET download image
app.get('/api/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filepath, filename);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// DELETE image
app.delete('/api/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file
    fs.unlinkSync(filepath);

    // Remove metadata
    const metadata = loadMetadata();
    delete metadata[filename];
    saveMetadata(metadata);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Creative Corex Gallery API' });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Creative Corex Gallery Server`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`💾 Max file size: 50MB`);
  console.log(`🌐 Frontend served from: ${path.join(__dirname, '../frontend')}`);
  console.log(`\n✨ Ready to serve AI art!\n`);
});
