const fs = require("fs");
const path = require("path");

let storedFiles = [];
let currentId = 1;

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// 1. Save file
function saveFile(file) {
  if (!file) return { error: "No file provided" };

  const newFileName = `${Date.now()}_${file.originalname}`;
  const filePath = path.join(UPLOAD_DIR, newFileName);

  // Save file to the disk
  fs.writeFileSync(filePath, file.buffer);

  const fileData = {
    id: currentId++,
    name: newFileName,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    path: filePath,
    url: `/uploads/${newFileName}`
  };

  storedFiles.push(fileData);

  return fileData;
}

// 2. Get file metadata by ID
function getFileById(id) {
  const file = storedFiles.find(f => f.id === Number(id));
  if (!file) return { error: "File not found" };
  return file;
}

// 3. Delete file by ID
function deleteFile(id) {
  const index = storedFiles.findIndex(f => f.id === Number(id));
  if (index === -1) return { error: "File not found" };

  const file = storedFiles[index];

  // Removes file from the disk
  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  storedFiles.splice(index, 1);

  return { success: true };
}

// 4. List all stored files
function listFiles() {
  return storedFiles;
}

module.exports = {
  saveFile,
  getFileById,
  deleteFile,
  listFiles
};
