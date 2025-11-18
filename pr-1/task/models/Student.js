const validator = require('../utils/validator');

class Student {
  constructor(id, name, age, group) {
    const validated = validator.validateStudentData(id, name, age, group);
    
    this.id = validated.id;
    this.name = validated.name;
    this.age = validated.age;
    this.group = validated.group;
  }
}

module.exports = Student;
