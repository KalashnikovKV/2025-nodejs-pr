const EventEmitter = require('events');
const Student = require('../models/Student');
const validator = require('../utils/validator');
const { createDataError } = require('../utils/errors');

class StudentManager extends EventEmitter {
  constructor(students = []) {
    super();
    this.students = students;
    this._maxIdCache = null;
  }

  #calculateMaxId() {
    if (this._maxIdCache !== null) {
      return this._maxIdCache;
    }
    
    let maxId = 0;
    for (const student of this.students) {
      const idNum = parseInt(student.id);
      if (!isNaN(idNum) && idNum > maxId) {
        maxId = idNum;
      }
    }
    this._maxIdCache = maxId;
    return maxId;
  }

  #invalidateIdCache() {
    this._maxIdCache = null;
  }

  addStudent(name, age, group) {
    const validated = validator.validateStudentDataWithoutId(name, age, group);

    const maxId = this.#calculateMaxId();
    const id = String(maxId + 1);
    
    const student = new Student(id, validated.name, validated.age, validated.group);
    this.students.push(student);
    this._maxIdCache = maxId + 1;
    
    this.emit('student:added', student);
    return student;
  }

  removeStudent(id) {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      const removedStudent = this.students[index];
      this.students.splice(index, 1);
      this.#invalidateIdCache();
      this.emit('student:removed', removedStudent);
      return true;
    }
    return false;
  }

  getStudentById(id) {
    return this.students.find(s => s.id === id);
  }

  getStudentsByGroup(group) {
    return this.students.filter(s => String(s.group) === String(group));
  }

  getAllStudents() {
    return [...this.students];
  }

  calculateAverageAge() {
    if (this.students.length === 0) {
      return 0;
    }
    const sum = this.students.reduce((acc, student) => acc + student.age, 0);
    return sum / this.students.length;
  }

  loadFromJSON(jsonData) {
    if (!Array.isArray(jsonData)) {
      throw createDataError('INVALID_JSON_ARRAY');
    }
    this.students = jsonData.map((item, index) => {
      try {
        return new Student(item.id, item.name, item.age, item.group);
      } catch (error) {
        throw createDataError('INVALID_STUDENT_AT_INDEX', index, error.message);
      }
    });
    this.#invalidateIdCache();
    this.emit('students:loaded', { count: this.students.length });
  }

  toJSON() {
    return this.students.map(student => ({
      id: student.id,
      name: student.name,
      age: student.age,
      group: student.group
    }));
  }

  getStatistics() {
    const total = this.students.length;
    if (total === 0) {
      return {
        total: 0,
        averageAge: 0,
        groups: {},
        ageRange: { min: 0, max: 0 }
      };
    }

    const ages = this.students.map(s => s.age);
    const groups = {};
    this.students.forEach(student => {
      const groupKey = String(student.group);
      groups[groupKey] = (groups[groupKey] || 0) + 1;
    });

    return {
      total,
      averageAge: this.calculateAverageAge(),
      groups,
      ageRange: {
        min: Math.min(...ages),
        max: Math.max(...ages)
      }
    };
  }
}

module.exports = StudentManager;
