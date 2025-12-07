const Student = require('./models/Student');
const StudentManager = require('./services/StudentManager');
const FileManager = require('./services/FileManager');
const BackupManager = require('./services/BackupManager');
const BackupReporter = require('./services/BackupReporter');
const Logger = require('./utils/Logger');
const parseCLIArguments = require('./utils/CLIParser');
const constants = require('./utils/constants');
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, 'students.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

let verbose, quiet, addStudent;
let logger;

try {
  const parsed = parseCLIArguments();
  verbose = parsed.verbose;
  quiet = parsed.quiet;
  addStudent = parsed.addStudent;
  
  logger = new Logger(verbose, quiet);
} catch (error) {
  const tempLogger = new Logger(false, false);
  tempLogger.log(`Error parsing CLI arguments: ${error.message}`);
  process.exit(1);
}

const initialStudents = [
  new Student("1", "John Doe", 20, 2),
  new Student("2", "Jane Smith", 23, 3),
  new Student("3", "Mike Johnson", 18, 2),
];

let studentManager;
let backupManager;

async function loadStudents() {
  try {
    const jsonData = await FileManager.loadJSON(DATA_FILE_PATH);
    if (jsonData.length > 0) {
      const manager = new StudentManager();
      manager.loadFromJSON(jsonData);
      return manager;
    }
  } catch (error) {
    logger.log(`Warning: Could not load students from file: ${error.message}`);
    logger.log('Using initial students data');
  }
  return new StudentManager(initialStudents);
}

function setupEventListeners() {
  studentManager.on('student:added', (student) => {
    logger.log(`Event: Student added - ${student.name} (ID: ${student.id})`);
  });

  studentManager.on('student:removed', (student) => {
    logger.log(`Event: Student removed - ${student.name} (ID: ${student.id})`);
  });

  studentManager.on('students:loaded', (data) => {
    logger.log(`Event: ${data.count} students loaded`);
  });

  backupManager.on('backup:started', (data) => {
    logger.log(`Event: Backup started (interval: ${data.intervalMs}ms)`);
  });

  backupManager.on('backup:stopped', () => {
    logger.log('Event: Backup stopped');
  });

  backupManager.on('backup:success', (data) => {
    logger.log(`Event: Backup successful - ${path.basename(data.filePath)} (${data.studentsCount} students)`);
  });

  backupManager.on('backup:error', (error) => {
    logger.log(`Event: Backup error - ${error.message}`);
  });
}

function formatStudent(student) {
  return `ID: ${student.id}, Name: ${student.name}, Age: ${student.age}, Group: ${student.group}`;
}

async function saveStudents() {
  try {
    await FileManager.saveToJSON(studentManager.toJSON(), DATA_FILE_PATH);
    logger.log(`Students saved to ${DATA_FILE_PATH}`);
  } catch (error) {
    logger.log(`Error saving: ${error.message}`);
  }
}

async function handleAddStudent() {
  try {
    const newStudent = studentManager.addStudent(addStudent.name, addStudent.age, addStudent.group);
    logger.log(`Student added successfully! ${formatStudent(newStudent)}`);
    await saveStudents();
  } catch (error) {
    logger.log(`Error adding student: ${error.message}`);
    process.exit(1);
  }
}

function displayAllStudents() {
  const students = studentManager.getAllStudents();
  if (students.length === 0) {
    logger.log('\nNo students found.');
    return;
  }
  logger.log(`\nAll students (${students.length}):`);
  students.forEach(student => {
    logger.log(formatStudent(student));
  });
}

function displayStudentById(id) {
  logger.log(`\nGetting student by ID "${id}":`);
  const student = studentManager.getStudentById(id);
  if (student) {
    logger.log(`Found: ${student.name}`);
  } else {
    logger.log(`Student with ID "${id}" not found`);
  }
}

function displayStudentsByGroup(group) {
  logger.log(`\nStudents in group ${group}:`);
  const students = studentManager.getStudentsByGroup(group);
  if (students.length === 0) {
    logger.log(`No students found in group ${group}`);
  } else {
    students.forEach(s => {
      logger.log(`- ${s.name}`);
    });
  }
}

function displayAverageAge() {
  const avgAge = studentManager.calculateAverageAge();
  logger.log(`\nAverage age: ${avgAge.toFixed(2)}`);
}

function displayStatistics() {
  const stats = studentManager.getStatistics();
  logger.log(`Total students: ${stats.total}`);
  if (stats.total > 0) {
    logger.log(`Average age: ${stats.averageAge.toFixed(2)}`);
    logger.log(`Age range: ${stats.ageRange.min} - ${stats.ageRange.max}`);
    logger.log('Students by group:');
    Object.entries(stats.groups).forEach(([group, count]) => {
      logger.log(`  Group ${group}: ${count} student(s)`);
    });
  }
}

async function main() {
  studentManager = await loadStudents();
  backupManager = new BackupManager(studentManager, BACKUP_DIR, 30000);
  
  setupEventListeners();
  backupManager.start();

  if (addStudent) {
    await handleAddStudent();
    backupManager.stop();
    return;
  }

  displayAllStudents();
  displayStudentById(constants.DEMO_STUDENT_ID);
  displayStudentsByGroup(constants.DEMO_GROUP);
  displayAverageAge();
  displayStatistics();
  await saveStudents();

  setTimeout(async () => {
    const reporter = new BackupReporter(BACKUP_DIR);
    await reporter.printReport();
    backupManager.stop();
  }, 35000);
}

module.exports = {
  Student,
  StudentManager,
  FileManager,
  BackupManager,
  BackupReporter,
  Logger,
  logger
};

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}
