const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve the data folder statically
app.use('/data', express.static(path.join(__dirname, 'data')));

// Serve the public folder statically
app.use(express.static(path.join(__dirname, 'public')));

// Route to display contents of a file or list contents of a directory in the data folder and its subfolders
app.get('/api/data/*', (req, res) => {
  const relativePath = req.params[0];
  const filepath = path.join(__dirname, 'data', relativePath);

  console.log(`Requested file path: ${filepath}`);
  if (!fs.existsSync(filepath)) {
    console.error(`File not found: ${filepath}`);
    return res.status(404).json({ error: 'File not found - No file' });
  }
  


  fs.stat(filepath, (err, stats) => {
    if (err) {
      console.error(`Error accessing file: ${err.message}`);
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      }
      return res.status(500).json({ error: 'Server error' });
    }

    if (stats.isDirectory()) {
      fs.readdir(filepath, (err, files) => {
        if (err) {
          console.error(`Error reading directory: ${err.message}`);
          return res.status(500).json({ error: 'Server error' });
        }
        return res.json({ directory: relativePath, files });
      });
    } else {
      const fileStream = fs.createReadStream(filepath);
      fileStream.on('error', (error) => {
        console.error(`Error reading file: ${error.message}`);
        return res.status(500).json({ error: 'Server error' });
      });
      res.setHeader('Content-Type', 'image/png'); // Set the correct content type for the image
      fileStream.pipe(res);
    }
  });
});
// Route to serve a specific HTML file when the URL ends with .png
//app.get('/*.png', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'image-viewer.html'));
//});
// Root route
app.get('/*', (req, res) => {
  if (req.path.endsWith('.png')) {
    res.sendFile(path.join(__dirname, 'public', 'image-viewer.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});