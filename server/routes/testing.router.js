// testing.router.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Define the base path for test data files
const testDataPath = path.join(__dirname, '../../test_data/cache');

// Define routes for each API endpoint
router.get('/typeahead/:city', (req, res) => {
    const { city } = req.params;
    const fileName = `${city}TypeaheadTestData.json`;
    const filePath = path.join(testDataPath, fileName);
    sendTestData(res, filePath);
});

router.get('/search/:city', (req, res) => {
    const { city } = req.params;
    const fileName = `${city}SearchTestData.json`;
    const filePath = path.join(testDataPath, fileName);
    sendTestData(res, filePath);
});

router.get('/details/:city', (req, res) => {
    const { city } = req.params;
    const fileName = `${city}DetailsTestData.json`;
    const filePath = path.join(testDataPath, fileName);
    sendTestData(res, filePath);
});

// Helper function to send test data from file
function sendTestData(res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading test data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
}

module.exports = router;
