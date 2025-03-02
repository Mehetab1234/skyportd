const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');

const router = express.Router();

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Unzip route
router.post('/unzip', upload.single('zipfile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const zipFilePath = req.file.path;
    const extractPath = path.join(__dirname, '../unzipped');

    try {
        // Create extraction folder if it doesn't exist
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath);
        }

        // Unzip the file
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: extractPath }))
            .on('close', () => {
                fs.unlinkSync(zipFilePath); // Delete ZIP after extraction
                res.json({ message: 'File unzipped successfully!', path: extractPath });
            })
            .on('error', (err) => {
                res.status(500).send('Error unzipping file: ' + err.message);
            });

    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

module.exports = router;
