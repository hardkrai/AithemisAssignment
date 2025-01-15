const express = require('express');
const multer = require('multer');
const fs = require('fs').promises; // Use the promise-based API
const path = require('path');
const cors = require('cors');
const { processQuery } = require('./langchain-utils');
const { extractPDFText } = require('./pdf-parser');

const app = express();

// Define upload directory
const uploadDir = path.join(__dirname, 'uploads');

// Ensure the uploads folder exists
(async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Error creating upload directory:', err);
  }
})();

// Enable CORS
app.use(cors());
app.use(express.json());

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'upload.pdf'); // Always save as "upload.pdf"
  },
});

const upload = multer({ storage });

// Upload PDF endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Ensure the file is a PDF
  if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
    // Delete the invalid file
    await fs.unlink(file.path);
    return res.status(400).json({ error: 'Only PDF files are allowed' });
  }

  const filePath = path.join(uploadDir, 'upload.pdf');

  try {
    const pdfText = await extractPDFText(filePath);

    if (!pdfText) {
      return res.status(500).json({ error: 'Failed to extract text from PDF' });
    }

    return res.status(200).json({
      message: 'File uploaded and processed successfully',
      filePath: `/uploads/upload.pdf`,
      textExtracted: pdfText.slice(0, 500),
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return res.status(500).json({ error: 'Failed to process the file' });
  }
});

// Query PDF content endpoint
app.post('/query', async (req, res) => {
  try {
    const { filePath, question } = req.body;

    if (!filePath || !question) {
      return res.status(400).json({ error: 'File path and question are required.' });
    }

    const answer = await processQuery(filePath, question);

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to process the query. Please try again later.' });
  }
});

// Serve static files
app.use('/uploads', express.static(uploadDir));

// Export the app as a serverless function
module.exports = app;
