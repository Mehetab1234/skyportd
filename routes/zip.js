const express = require('express');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Zip route
router.post('/zip', async (req, res) => {
    const { folderPath } = req.body;

    if (!folderPath || !fs.existsSync(folderPath)) {
        return res.status(400).json({ error: 'Invalid folder path' });
    }

    const zipFileName = `archive_${Date.now()}.zip`;
    const zipFilePath = path.join(__dirname, '../zipped', zipFileName);

    // Ensure the "zipped" directory exists
    if (!fs.existsSync(path.join(__dirname, '../zipped'))) {
        fs.mkdirSync(path.join(__dirname, '../zipped'));
    }

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        res.json({ message: 'Folder zipped successfully!', zipFile: zipFilePath });
    });

    archive.on('error', (err) => res.status(500).json({ error: err.message }));

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
});

module.exports = router;
