const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// @desc    Upload business idea image
// @route   POST /api/upload/business-image
// @access  Private
router.post('/business-image', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Process image with Sharp
        const filename = `business-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
        const filepath = path.join('uploads', filename);

        // Create uploads directory if it doesn't exist
        const fs = require('fs');
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Resize and optimize image
        await sharp(req.file.buffer)
            .resize(800, 600, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toFile(filepath);

        // Return image info
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                filename,
                originalName: req.file.originalname,
                mimetype: 'image/jpeg',
                size: req.file.size,
                url: `/uploads/${filename}`
            }
        });

    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Upload error'
        });
    }
});

// @desc    Get uploaded file
// @route   GET /api/upload/:filename
// @access  Public
router.get('/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, '..', 'uploads', filename);
        
        // Check if file exists
        const fs = require('fs');
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.sendFile(filepath);
    } catch (error) {
        console.error('File serve error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to serve file'
        });
    }
});

module.exports = router;