const assert = require('assert');
const StudentManager = require('../services/StudentManager');

function runTests() {
  console.log('Running StudentManager tests...');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      passed++;
      console.log(`  PASS ${name}`);
    } catch (error) {
      failed++;
      console.error(`  FAIL ${name}`);
      console.error(`    ${error.message}`);
    }
  }

  function beforeEach(fn) {
    fn();
  }

  test('should add student', () => {
    const manager = new StudentManager();
    const student = manager.addStudent("John Doe", 20, 2);
    
    assert.strictEqual(student.name, "John Doe");
    assert.strictEqual(student.age, 20);
    assert.strictEqual(student.group, 2);
    assert.strictEqual(student.id, "1");
    assert.strictEqual(manager.getAllStudents().length, 1);
  });

  test('should remove student', () => {
    const manager = new StudentManager();
    manager.addStudent("John Doe", 20, 2);
    manager.addStudent("Jane Smith", 23, 3);
    
    const removed = manager.removeStudent("1");
    assert.strictEqual(removed, true);
    assert.strictEqual(manager.getAllStudents().length, 1);
    assert.strictEqual(manager.getStudentById("1"), undefined);
    
    const notRemoved = manager.removeStudent("999");
    assert.strictEqual(notRemoved, false);
  });

  test('should get student by ID', () => {
    const manager = new StudentManager();
    manager.addStudent("John Doe", 20, 2);
    
    const student = manager.getStudentById("1");
    assert.strictEqual(student.name, "John Doe");
    
    const notFound = manager.getStudentById("999");
    assert.strictEqual(notFound, undefined);
  });

  test('should get students by group', () => {
    const manager = new StudentManager();
    manager.addStudent("John Doe", 20, 2);
    manager.addStudent("Jane Smith", 23, 3);
    manager.addStudent("Mike Johnson", 18, 2);
    
    const group2 = manager.getStudentsByGroup(2);
    assert.strictEqual(group2.length, 2);
    assert.strictEqual(group2[0].name, "John Doe");
    assert.strictEqual(group2[1].name, "Mike Johnson");
    
    const group3 = manager.getStudentsByGroup(3);
    assert.strictEqual(group3.length, 1);
    assert.strictEqual(group3[0].name, "Jane Smith");
  });

  test('should calculate average age', () => {
    const manager = new StudentManager();
    assert.strictEqual(manager.calculateAverageAge(), 0);
    
    manager.addStudent("John Doe", 20, 2);
    manager.addStudent("Jane Smith", 30, 3);
    
    const avg = manager.calculateAverageAge();
    assert.strictEqual(avg, 25);
  });

  test('should convert to JSON', () => {
    const manager = new StudentManager();
    manager.addStudent("John Doe", 20, 2);
    
    const json = manager.toJSON();
    assert.strictEqual(Array.isArray(json), true);
    assert.strictEqual(json.length, 1);
    assert.strictEqual(json[0].name, "John Doe");
    assert.strictEqual(json[0].age, 20);
    assert.strictEqual(json[0].group, 2);
  });

  test('should load from JSON', () => {
    const manager = new StudentManager();
    const jsonData = [
      { id: "1", name: "John Doe", age: 20, group: 2 },
      { id: "2", name: "Jane Smith", age: 23, group: 3 }
    ];
    
    manager.loadFromJSON(jsonData);
    assert.strictEqual(manager.getAllStudents().length, 2);
    assert.strictEqual(manager.getStudentById("1").name, "John Doe");
  });

  test('should throw error for invalid JSON data', () => {
    const manager = new StudentManager();
    assert.throws(() => {
      manager.loadFromJSON({ not: "array" });
    }, /Invalid JSON data: expected array/);
  });

  test('should get statistics', () => {
    const manager = new StudentManager();
    const emptyStats = manager.getStatistics();
    assert.strictEqual(emptyStats.total, 0);
    assert.strictEqual(emptyStats.averageAge, 0);
    
    manager.addStudent("John Doe", 20, 2);
    manager.addStudent("Jane Smith", 30, 2);
    manager.addStudent("Mike Johnson", 25, 3);
    
    const stats = manager.getStatistics();
    assert.strictEqual(stats.total, 3);
    assert.strictEqual(stats.averageAge, 25);
    assert.strictEqual(stats.ageRange.min, 20);
    assert.strictEqual(stats.ageRange.max, 30);
    assert.strictEqual(stats.groups["2"], 2);
    assert.strictEqual(stats.groups["3"], 1);
  });

  test('should generate sequential IDs', () => {
    const manager = new StudentManager();
    const student1 = manager.addStudent("John Doe", 20, 2);
    const student2 = manager.addStudent("Jane Smith", 23, 3);
    const student3 = manager.addStudent("Mike Johnson", 18, 2);
    
    assert.strictEqual(student1.id, "1");
    assert.strictEqual(student2.id, "2");
    assert.strictEqual(student3.id, "3");
  });

  return { passed, failed };
}

if (require.main === module) {
  const result = runTests();
  console.log(`\nStudentManager tests: ${result.passed} passed, ${result.failed} failed`);
  process.exit(result.failed > 0 ? 1 : 0);
}

module.exports = runTests;
