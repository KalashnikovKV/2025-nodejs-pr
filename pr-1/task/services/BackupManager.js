const EventEmitter = require('events');
const FileManager = require('./FileManager');
const { createBackupError } = require('../utils/errors');
const path = require('path');
const fs = require('fs').promises;

class BackupManager extends EventEmitter {
  constructor(studentManager, backupDir, intervalMs = 30000) {
    super();
    this.studentManager = studentManager;
    this.backupDir = backupDir;
    this.intervalMs = intervalMs;
    this.intervalId = null;
    this.isBackupInProgress = false;
    this.pendingIntervalsCount = 0;
    this.maxPendingIntervals = 3;
  }

  async ensureBackupDirectory() {
    try {
      await fs.access(this.backupDir);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(this.backupDir, { recursive: true });
      } else {
        throw error;
      }
    }
  }

  generateBackupFileName() {
    const timestamp = Date.now();
    return path.join(this.backupDir, `${timestamp}.backup.json`);
  }

  async performBackup() {
    if (this.isBackupInProgress) {
      this.pendingIntervalsCount++;
      
      if (this.pendingIntervalsCount >= this.maxPendingIntervals) {
        const error = createBackupError('PENDING_OPERATION_TIMEOUT', this.maxPendingIntervals);
        this.emit('backup:error', error);
        throw error;
      }
      
      return;
    }

    this.isBackupInProgress = true;
    this.pendingIntervalsCount = 0;

    try {
      await this.ensureBackupDirectory();
      
      const studentsData = this.studentManager.toJSON();
      const backupFilePath = this.generateBackupFileName();
      
      await FileManager.saveToJSON(studentsData, backupFilePath);
      
      this.emit('backup:success', {
        filePath: backupFilePath,
        timestamp: Date.now(),
        studentsCount: studentsData.length
      });
    } catch (error) {
      this.emit('backup:error', error);
    } finally {
      this.isBackupInProgress = false;
    }
  }

  start() {
    if (this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.performBackup().catch(error => {
        this.emit('backup:error', error);
      });
    }, this.intervalMs);

    this.emit('backup:started', { intervalMs: this.intervalMs });
  }

  stop() {
    if (this.intervalId === null) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isBackupInProgress = false;
    this.pendingIntervalsCount = 0;

    this.emit('backup:stopped');
  }

  isRunning() {
    return this.intervalId !== null;
  }
}

module.exports = BackupManager;

