const fs = require('fs').promises;
const path = require('path');
const { createFileError } = require('../utils/errors');

async function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  try {
    await fs.access(dir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dir, { recursive: true });
    } else {
      throw error;
    }
  }
}

async function saveToJSON(data, filePath) {
  try {
    await ensureDirectoryExists(filePath);
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonData, 'utf8');
  } catch (error) {
    throw createFileError('FAILED_TO_SAVE', error.message);
  }
}

async function loadJSON(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
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
