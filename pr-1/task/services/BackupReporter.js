const fs = require('fs').promises;
const path = require('path');
const { createBackupError } = require('../utils/errors');

class BackupReporter {
  constructor(backupDir) {
    this.backupDir = backupDir;
  }

  async getBackupFiles() {
    try {
      const files = await fs.readdir(this.backupDir);
      return files
        .filter(file => file.endsWith('.backup.json'))
        .map(file => path.join(this.backupDir, file));
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  extractTimestampFromFileName(filePath) {
    const fileName = path.basename(filePath);
    const match = fileName.match(/^(\d+)\.backup\.json$/);
    return match ? parseInt(match[1], 10) : null;
  }

  async readBackupFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw createBackupError('FAILED_TO_READ_BACKUP', filePath, error.message);
    }
  }

  async generateReport() {
    const backupFiles = await this.getBackupFiles();
    
    if (backupFiles.length === 0) {
      return {
        totalBackups: 0,
        latestBackup: null,
        studentsById: [],
        averageStudentsCount: 0
      };
    }

    let latestBackup = null;
    let latestTimestamp = 0;
    const studentsById = {};
    let totalStudentsCount = 0;

    for (const filePath of backupFiles) {
      const timestamp = this.extractTimestampFromFileName(filePath);
      
      if (timestamp && timestamp > latestTimestamp) {
        latestTimestamp = timestamp;
        latestBackup = {
          filePath,
          timestamp,
          readableDate: new Date(timestamp).toISOString()
        };
      }

      try {
        const students = await this.readBackupFile(filePath);
        
        if (Array.isArray(students)) {
          totalStudentsCount += students.length;
          
          students.forEach(student => {
            if (student && student.id) {
              const id = String(student.id);
              studentsById[id] = (studentsById[id] || 0) + 1;
            }
          });
        }
      } catch (error) {
        console.error(`Error processing backup file ${filePath}: ${error.message}`);
      }
    }

    const studentsByIdArray = Object.entries(studentsById).map(([id, amount]) => ({
      id,
      amount
    }));

    const averageStudentsCount = backupFiles.length > 0 
      ? totalStudentsCount / backupFiles.length 
      : 0;

    return {
      totalBackups: backupFiles.length,
      latestBackup: latestBackup ? {
        file: path.basename(latestBackup.filePath),
        timestamp: latestBackup.timestamp,
        readableDate: latestBackup.readableDate
      } : null,
      studentsById: studentsByIdArray,
      averageStudentsCount: Math.round(averageStudentsCount * 100) / 100
    };
  }

  async printReport() {
    const report = await this.generateReport();
    
    console.log('\n=== Backup Report ===');
    console.log(`Total backup files: ${report.totalBackups}`);
    
    if (report.latestBackup) {
      console.log(`Latest backup: ${report.latestBackup.file}`);
      console.log(`Latest backup date: ${report.latestBackup.readableDate}`);
    } else {
      console.log('No backup files found');
    }
    
    console.log('\nStudents by ID:');
    if (report.studentsById.length > 0) {
      console.log(JSON.stringify(report.studentsById, null, 2));
    } else {
      console.log('No students found in backup files');
    }
    
    console.log(`\nAverage students count: ${report.averageStudentsCount}`);
    console.log('====================\n');
    
    return report;
  }
}

module.exports = BackupReporter;

