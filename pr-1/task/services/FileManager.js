const fs = require('fs');
const path = require('path');
const { createFileError } = require('../utils/errors');

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveToJSON(data, filePath) {
  try {
    ensureDirectoryExists(filePath);
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
  } catch (error) {
    throw createFileError('FAILED_TO_SAVE', error.message);
  }
}

function loadJSON(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (!fileContent.trim()) {
      return [];
    }
    const parsed = JSON.parse(fileContent);
    if (!Array.isArray(parsed)) {
      throw createFileError('FILE_NOT_ARRAY');
    }
    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    if (error instanceof SyntaxError) {
      throw createFileError('INVALID_JSON_FORMAT', error.message);
    }
    throw createFileError('FAILED_TO_LOAD', error.message);
  }
}

module.exports = {
  saveToJSON,
  loadJSON
};
