const constants = require('./constants');

const ValidationErrors = {
  ID_MUST_BE_STRING: 'Student ID must be a non-empty string',
  NAME_MUST_BE_STRING: 'Student name must be a non-empty string',
  NAME_TOO_LONG: (maxLength) => `Student name must not exceed ${maxLength} characters`,
  AGE_MUST_BE_NUMBER: 'Student age must be a number',
  AGE_OUT_OF_RANGE: (min, max) => `Student age must be between ${min} and ${max}`,
  GROUP_MUST_BE_SPECIFIED: 'Student group must be specified',
  GROUP_CANNOT_BE_EMPTY: 'Student group cannot be empty'
};

const CLIErrors = {
  VERBOSE_QUIET_CONFLICT: 'Cannot use --verbose and --quiet flags together',
  ADD_REQUIRES_ARGS: '--add requires 3 arguments: name, age, group',
  INVALID_STUDENT_DATA: (message) => `Invalid student data: ${message}`
};

const FileErrors = {
  FAILED_TO_SAVE: (message) => `Failed to save file: ${message}`,
  FAILED_TO_LOAD: (message) => `Failed to load file: ${message}`,
  INVALID_JSON_FORMAT: (message) => `Invalid JSON format: ${message}`,
  FILE_NOT_ARRAY: 'File does not contain a valid array'
};

const DataErrors = {
  INVALID_JSON_ARRAY: 'Invalid JSON data: expected array',
  INVALID_STUDENT_AT_INDEX: (index, message) => `Invalid student data at index ${index}: ${message}`
};

const BackupErrors = {
  PENDING_OPERATION_TIMEOUT: (intervals) => `Backup operation is pending for ${intervals} intervals`,
  FAILED_TO_READ_BACKUP: (filePath, message) => `Failed to read backup file ${filePath}: ${message}`
};

function createValidationError(type, ...args) {
  const message = typeof ValidationErrors[type] === 'function' 
    ? ValidationErrors[type](...args)
    : ValidationErrors[type];
  return new Error(message);
}

function createCLIError(type, ...args) {
  const message = typeof CLIErrors[type] === 'function'
    ? CLIErrors[type](...args)
    : CLIErrors[type];
  return new Error(message);
}

function createFileError(type, ...args) {
  const message = typeof FileErrors[type] === 'function'
    ? FileErrors[type](...args)
    : FileErrors[type];
  return new Error(message);
}

function createDataError(type, ...args) {
  const message = typeof DataErrors[type] === 'function'
    ? DataErrors[type](...args)
    : DataErrors[type];
  return new Error(message);
}

function createBackupError(type, ...args) {
  const message = typeof BackupErrors[type] === 'function'
    ? BackupErrors[type](...args)
    : BackupErrors[type];
  return new Error(message);
}

module.exports = {
  ValidationErrors,
  CLIErrors,
  FileErrors,
  DataErrors,
  BackupErrors,
  createValidationError,
  createCLIError,
  createFileError,
  createDataError,
  createBackupError
};

