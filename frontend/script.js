const API_URL = window.location.origin.startsWith('file:') || window.location.origin === 'null'
  ? 'http://localhost:3000'
  : window.location.origin;
const ADMIN_PASSWORD = 'creativecorex2024'; // Change this!

// State
let allImages = [];
let filteredImages = [];
let currentFilter = 'all';
let isAdminLoggedIn = false;

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.querySelectorAll('.filter-tab');
const totalImagesEl = document.getElementById('totalImages');

// Modal elements
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDescription = document.getElementById('modalDescription');
const modalSize = document.getElementById('modalSize');
const modalDate = document.getElementById('modalDate');
const downloadBtn = document.getElementById('downloadBtn');
const closeModal = document.getElementById('closeModal');

// Admin elements
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const closeAdmin = document.getElementById('closeAdmin');
const adminPassword = document.getElementById('adminPassword');
const adminSubmit = document.getElementById('adminSubmit');
const adminError = document.getElementById('adminError');
const adminPanel = document.getElementById('adminPanel');
const closePanel = document.getElementById('closePanel');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imageTitle = document.getElementById('imageTitle');
const imageDescription = document.getElementById('imageDescription');
const imageCategory = document.getElementById('imageCategory');
const uploadSubmit = document.getElementById('uploadSubmit');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let currentImageData = null;
let selectedFile = null;

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  loadImages();
  setupEventListeners();
});

// Load images from backend
async function loadImages() {
  try {
    loading.style.display = 'flex';
    galleryGrid.innerHTML = '';
    emptyState.style.display = 'none';

    const response = await fetch(`${API_URL}/api/images`);
    allImages = await response.json();

    totalImagesEl.textContent = allImages.length;

    applyFilters();
  } catch (error) {
    console.error('Error loading images:', error);
    loading.style.display = 'none';
    galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 60px;">Unable to load images. Make sure the server is running.</p>';
  }
}

// Apply search and category filters
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  filteredImages = allImages.filter(img => {
    const matchesSearch = !searchTerm ||
      (img.title && img.title.toLowerCase().includes(searchTerm)) ||
      (img.description && img.description.toLowerCase().includes(searchTerm));

    const matchesCategory = currentFilter === 'all' || img.category === currentFilter;

    return matchesSearch && matchesCategory;
  });

  renderGallery();
}

// Render gallery
function renderGallery() {
  loading.style.display = 'none';
  galleryGrid.innerHTML = '';

  if (filteredImages.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  filteredImages.forEach(image => {
    const card = createGalleryCard(image);
    galleryGrid.appendChild(card);
  });
}

// Create gallery card
function createGalleryCard(image) {
  const card = document.createElement('div');
  card.className = 'gallery-card';

  const title = image.title || image.filename;
  const category = image.category || 'other';

  card.innerHTML = `
    <div class="card-img-wrapper">
      <img src="${image.url}" alt="${title}" class="card-img" loading="lazy">
      <div class="card-overlay">
        <h3 class="overlay-title">${title}</h3>
        <button class="overlay-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download
        </button>
      </div>
    </div>
    <div class="card-info">
      <div class="card-meta">
        <span class="card-title">${title}</span>
        <span class="card-tag">${category}</span>
      </div>
    </div>
  `;

  card.addEventListener('click', () => openImageModal(image));

  return card;
}

// Open image modal
function openImageModal(image) {
  currentImageData = image;

  modalImage.src = image.url;
  modalTitle.textContent = image.title || image.filename;
  modalCategory.textContent = image.category || 'other';
  modalDescription.textContent = image.description || 'High-quality AI-generated artwork by Creative Corex.';

  // Format file size
  const sizeInMB = (image.size / (1024 * 1024)).toFixed(2);
  modalSize.textContent = `${sizeInMB} MB`;

  // Format date
  const date = new Date(image.uploadDate);
  modalDate.textContent = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  imageModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close image modal
function closeImageModal() {
  imageModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Download image
async function downloadImage() {
  if (!currentImageData) return;

  try {
    const response = await fetch(`${API_URL}/api/download/${currentImageData.filename}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentImageData.filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading image:', error);
    alert('Failed to download image. Please try again.');
  }
}

// Admin Login
function openAdminLogin() {
  adminModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  adminPassword.value = '';
  adminError.textContent = '';
}

function closeAdminLogin() {
  adminModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function attemptAdminLogin() {
  const password = adminPassword.value;

  if (password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    closeAdminLogin();
    openAdminPanel();
  } else {
    adminError.textContent = 'Incorrect password';
    adminPassword.value = '';
  }
}

// Admin Panel
function openAdminPanel() {
  adminPanel.classList.add('active');
}

function closeAdminPanel() {
  adminPanel.classList.remove('active');
  resetUploadForm();
}

function resetUploadForm() {
  selectedFile = null;
  fileInput.value = '';
  imageTitle.value = '';
  imageDescription.value = '';
  imageCategory.value = 'portrait';
  uploadProgress.style.display = 'none';
  progressFill.style.width = '0%';

  // Reset upload area
  uploadArea.innerHTML = `
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
    <p class="upload-text">Drag & drop your image here</p>
    <p class="upload-hint">or click to browse • Max 50MB</p>
  `;
}

// File selection
function handleFileSelect(file) {
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // Validate file size (50MB)
  if (file.size > 50 * 1024 * 1024) {
    alert('File size must be less than 50MB');
    return;
  }

  selectedFile = file;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadArea.innerHTML = `
      <img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 8px; object-fit: contain;">
      <p class="upload-text" style="margin-top: 12px;">${file.name}</p>
      <p class="upload-hint">${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
    `;
  };
  reader.readAsDataURL(file);

  // Auto-fill title from filename
  if (!imageTitle.value) {
    const titleFromFile = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    imageTitle.value = titleFromFile.charAt(0).toUpperCase() + titleFromFile.slice(1);
  }
}

// Upload image
async function uploadImage() {
  if (!selectedFile) {
    alert('Please select an image first');
    return;
  }

  if (!imageTitle.value.trim()) {
    alert('Please enter a title');
    imageTitle.focus();
    return;
  }

  const formData = new FormData();
  formData.append('image', selectedFile);
  formData.append('title', imageTitle.value.trim());
  formData.append('description', imageDescription.value.trim());
  formData.append('category', imageCategory.value);

  try {
    uploadSubmit.disabled = true;
    uploadProgress.style.display = 'block';
    progressText.textContent = 'Uploading...';

    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      progressFill.style.width = progress + '%';
    }, 200);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });

    clearInterval(progressInterval);

    const result = await response.json();

    if (response.ok) {
      progressFill.style.width = '100%';
      progressText.textContent = 'Upload complete!';

      setTimeout(() => {
        closeAdminPanel();
        loadImages(); // Reload gallery
      }, 1000);
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Failed to upload image: ' + error.message);
    uploadProgress.style.display = 'none';
  } finally {
    uploadSubmit.disabled = false;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Search
  searchInput.addEventListener('input', applyFilters);

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      applyFilters();
    });
  });

  // Image modal
  closeModal.addEventListener('click', closeImageModal);
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) closeImageModal();
  });
  downloadBtn.addEventListener('click', downloadImage);

  // Admin
  adminBtn.addEventListener('click', openAdminLogin);
  closeAdmin.addEventListener('click', closeAdminLogin);
  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) closeAdminLogin();
  });
  adminSubmit.addEventListener('click', attemptAdminLogin);
  adminPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') attemptAdminLogin();
  });

  // Admin panel
  closePanel.addEventListener('click', closeAdminPanel);

  // File upload
  uploadArea.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });

  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#000';
    uploadArea.style.background = '#f9fafb';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#d1d5db';
    uploadArea.style.background = 'transparent';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#d1d5db';
    uploadArea.style.background = 'transparent';

    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });

  uploadSubmit.addEventListener('click', uploadImage);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (imageModal.classList.contains('active')) closeImageModal();
      if (adminModal.classList.contains('active')) closeAdminLogin();
      if (adminPanel.classList.contains('active')) closeAdminPanel();
    }
  });
}
