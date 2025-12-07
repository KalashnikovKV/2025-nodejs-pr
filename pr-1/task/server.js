const express = require('express');
const path = require('path');
const StudentManager = require('./services/StudentManager');
const FileManager = require('./services/FileManager');
const BackupManager = require('./services/BackupManager');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'students.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

const studentManager = new StudentManager();
const backupManager = new BackupManager(studentManager, BACKUP_DIR, 30000);

async function initialize() {
  try {
    const jsonData = await FileManager.loadJSON(DATA_FILE_PATH);
    studentManager.loadFromJSON(jsonData);
  } catch (error) {
    console.error('Ошибка при инициализации:', error.message);
  }
}

app.use(express.json());

app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
});

app.get('/api/students', (req, res) => {
  res.json(studentManager.getAllStudents());
});

app.post('/api/students', (req, res, next) => {
  const { name, age, group } = req.body;
  if (!name || age === undefined || group === undefined) {
    return res.status(400).json({ error: 'Missing required fields: name, age, group' });
  }
  try {
    const student = studentManager.addStudent(name, age, group);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

app.get('/api/students/:id', (req, res) => {
  const student = studentManager.getStudentById(req.params.id);
  if (!student) {
    return res.status(404).json({ error: `Student with ID "${req.params.id}" not found` });
  }
  res.json(student);
});

app.put('/api/students/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, age, group } = req.body;
  if (!name || age === undefined || group === undefined) {
    return res.status(400).json({ error: 'Missing required fields: name, age, group' });
  }
  try {
    const student = studentManager.updateStudent(id, name, age, group);
    if (!student) {
      return res.status(404).json({ error: `Student with ID "${id}" not found` });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  if (!studentManager.removeStudent(id)) {
    return res.status(404).json({ error: `Student with ID "${id}" not found` });
  }
  res.json({ message: `Student with ID "${id}" deleted successfully` });
});

app.get('/api/students/group/:id', (req, res) => {
  res.json(studentManager.getStudentsByGroup(req.params.id));
});

app.get('/api/students/average-age', (req, res) => {
  const averageAge = studentManager.calculateAverageAge();
  res.json({ averageAge: Number(averageAge.toFixed(2)) });
});

app.post('/api/students/save', async (req, res, next) => {
  try {
    await FileManager.saveToJSON(studentManager.toJSON(), DATA_FILE_PATH);
    res.json({ message: 'Students saved successfully' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/students/load', async (req, res, next) => {
  try {
    const jsonData = await FileManager.loadJSON(DATA_FILE_PATH);
    studentManager.loadFromJSON(jsonData);
    res.json({ message: 'Students loaded successfully', count: jsonData.length });
  } catch (error) {
    next(error);
  }
});

app.post('/api/backup/start', (req, res) => {
  if (backupManager.isRunning()) {
    return res.status(400).json({ error: 'Backup mechanism is already running' });
  }
  backupManager.start();
  res.json({ message: 'Backup mechanism started successfully' });
});

app.post('/api/backup/stop', (req, res) => {
  if (!backupManager.isRunning()) {
    return res.status(400).json({ error: 'Backup mechanism is not running' });
  }
  backupManager.stop();
  res.json({ message: 'Backup mechanism stopped successfully' });
});

app.get('/api/backup/status', (req, res) => {
  res.json({ 
    status: backupManager.isRunning() ? 'running' : 'stopped'
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

if (require.main === module) {
  initialize().then(() => {
    app.listen(PORT, () => {
      console.log(`Express сервер запущен на http://localhost:${PORT}`);
    });
  }).catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = app;

