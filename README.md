# Creative Corex - Professional AI Art Gallery

A modern, clean, and professional portfolio website for showcasing and downloading AI-generated artwork.

## ✨ Features

### For Visitors (Everyone)
- 🎨 **Beautiful Gallery** - Clean white theme with modern typography (Inter + Playfair Display)
- 🔍 **Smart Search** - Search artworks by title or description in real-time
- 🏷️ **Category Filters** - Browse by Portrait, Landscape, Abstract, or Other
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- ⬇️ **High-Quality Downloads** - Download original AI images up to 50MB
- 🖼️ **Rich Previews** - Full-screen modal with title, description, category, size, and date
- ⚡ **Fast Loading** - Lazy loading images for optimal performance
- 🎭 **Smooth Animations** - Elegant hover effects and transitions

### For You (Admin Only)
- 🔐 **Password Protected** - Only you can upload (password: `creativecorex2024`)
- 📤 **Easy Upload** - Drag & drop or click to browse
- 📝 **Rich Metadata** - Add title, description, and category to each artwork
- 💾 **Large Files** - Support for AI images up to 50MB
- 📊 **Upload Progress** - Real-time upload progress indicator
- 🎯 **Auto-fill Title** - Automatically suggests title from filename

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher) - Download from https://nodejs.org/

### Step 1: Install Dependencies
Open terminal/command prompt and run:

```bash
cd C:\Users\Tanishq\Desktop\instagram-gallery\backend
npm install
```

This installs:
- `express` - Web server
- `cors` - Cross-origin support
- `multer` - File upload handling

### Step 2: Start the Backend Server
```bash
npm start
```

You should see:
```
🚀 Creative Corex Gallery Server
📡 Server running on http://localhost:3000
📁 Uploads directory: C:\Users\Tanishq\Desktop\instagram-gallery\backend\uploads
💾 Max file size: 50MB

✨ Ready to serve AI art!
```

**Keep this terminal window open!**

### Step 3: Open the Website
Simply double-click:
```
C:\Users\Tanishq\Desktop\instagram-gallery\frontend\index.html
```

Or for better experience, use a local server:
```bash
cd C:\Users\Tanishq\Desktop\instagram-gallery\frontend
python -m http.server 8000
```
Then open: http://localhost:8000

## 📖 How to Use

### Uploading Images (Admin)
1. Click the **"Admin"** button in the top navigation
2. Enter password: `creativecorex2024`
3. Click anywhere in the upload area or drag & drop your image
4. Fill in:
   - **Title** (required) - e.g., "Cyberpunk Cityscape"
   - **Description** (optional) - Brief description of the artwork
   - **Category** - Portrait, Landscape, Abstract, or Other
5. Click **"Upload Artwork"**
6. Wait for upload to complete
7. Your image appears in the gallery immediately!

### Downloading Images (Users)
1. Browse the gallery
2. Click any image to open full preview
3. Click the **"Download High Quality"** button
4. Original file downloads to your Downloads folder

### Searching & Filtering
- Use the search box to find artworks by title or description
- Click category tabs (All, Portraits, Landscapes, Abstract, Other)
- Filters work together - search + category

## 🎨 Customization

### Change Admin Password
Edit `frontend/script.js`, line 2:
```javascript
const ADMIN_PASSWORD = 'your-new-password-here';
```

### Change Server Port
Edit `backend/server.js`, line 8:
```javascript
const PORT = 3001; // Your preferred port
```

Also update `frontend/script.js`, line 1:
```javascript
const API_URL = 'http://localhost:3001';
```

### Update About Section
Edit `frontend/index.html`, lines 110-120 (About section):
```html
<p class="about-text">
  Your custom description here...
</p>
```

### Change Colors/Theme
Edit `frontend/style.css`, lines 2-12 (CSS variables):
```css
:root {
  --primary: #000000;        /* Main black color */
  --text-main: #1f2937;      /* Main text color */
  --text-muted: #6b7280;     /* Secondary text */
  --bg-main: #ffffff;        /* Background */
  --accent: #2563eb;         /* Accent blue */
  --border: #e5e7eb;         /* Border color */
}
```

### Add More Categories
Edit both files:

**frontend/index.html** (line 45):
```html
<button class="filter-tab" data-filter="newcategory">New Category</button>
```

**frontend/script.js** - No changes needed, it's dynamic!

**frontend/index.html** (line 88 - upload form):
```html
<option value="newcategory">New Category</option>
```

## 📁 Project Structure

```
instagram-gallery/
├── backend/
│   ├── server.js          # Express server with metadata support
│   ├── package.json       # Dependencies
│   ├── metadata.json      # Auto-generated metadata storage
│   └── uploads/           # Your uploaded images (auto-created)
│
└── frontend/
    ├── index.html         # Main HTML with modern structure
    ├── style.css          # Clean white theme + Inter/Playfair fonts
    ├── script.js          # Frontend logic with search/filter/upload
    └── assets/            # (Optional) For branding assets
```

## 🔧 Technical Details

### Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/images` | Get all images with metadata |
| POST | `/upload` | Upload image with title/description/category |
| GET | `/download/:filename` | Download original quality image |
| DELETE | `/image/:filename` | Delete image (protected) |
| GET | `/health` | Server health check |

### Metadata Storage
All image metadata (title, description, category, date) is stored in:
```
backend/metadata.json
```

Format:
```json
{
  "image-123456.jpg": {
    "title": "Cyberpunk Portrait",
    "description": "AI-generated futuristic portrait",
    "category": "portrait",
    "uploadDate": "2024-08-29T12:00:00.000Z"
  }
}
```

### File Size Limits
- **Max upload**: 50MB (perfect for high-resolution AI images)
- **Supported formats**: JPG, JPEG, PNG, WebP, GIF, BMP

## 🐛 Troubleshooting

### "npm is not recognized"
→ Install Node.js from https://nodejs.org/

### "Cannot find module 'express'"
→ Run `npm install` in the backend folder

### "Port 3000 already in use"
→ Change the port in `backend/server.js` and `frontend/script.js`

### Images not loading
→ Make sure backend server is running (`npm start`)

### Upload fails
→ Check file size (must be under 50MB) and format (image files only)

### Can't login as admin
→ Check password in `frontend/script.js` line 2 (default: `creativecorex2024`)

## 🎯 Modern Features

✅ **Professional Design** - Clean white background, Inter sans-serif for body text, Playfair Display serif for headings  
✅ **Admin Authentication** - Password-protected upload system  
✅ **Metadata System** - Rich information for each artwork  
✅ **Real-time Search** - Instant search results  
✅ **Category Filtering** - Organize artworks by type  
✅ **Lazy Loading** - Images load as you scroll  
✅ **Progress Indicator** - See upload progress in real-time  
✅ **Drag & Drop** - Modern file upload UX  
✅ **Keyboard Shortcuts** - ESC to close modals  
✅ **Responsive Grid** - Adapts to any screen size  
✅ **Smooth Animations** - Elegant transitions and hover effects  

## 📝 Notes

- The admin password is stored in the frontend code - change it after setup!
- For production use, consider implementing proper backend authentication
- All uploads are stored locally in `backend/uploads/`
- Metadata is stored in `backend/metadata.json`
- No database required - perfect for personal portfolios

## 🌟 Live Example

After setup, your site will have:
- **Homepage**: Hero section → Gallery → About → Footer
- **Gallery Cards**: Hover to see overlay with title and download button
- **Image Modal**: Click to see full image with metadata
- **Admin Panel**: Side panel for easy uploads

## 💡 Tips

1. **Organize Your AI Images**: Use meaningful titles and descriptions
2. **Categorize Properly**: Helps users find what they're looking for
3. **Compress Large Files**: Use tools like TinyPNG before uploading if needed
4. **Backup Regularly**: Copy `backend/uploads/` and `metadata.json` periodically

## 📞 Support

Built for Creative Corex by Claude (2024)

---

**Ready to showcase your AI art!** 🎨✨

Start the server, open the website, and begin uploading your creations!
