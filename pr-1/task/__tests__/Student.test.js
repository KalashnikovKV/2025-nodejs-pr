const assert = require('assert');
const Student = require('../models/Student');

function runTests() {
  console.log('Running Student tests...');
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

  test('should create student with valid data', () => {
    const student = new Student("1", "John Doe", 20, 2);
    assert.strictEqual(student.id, "1");
    assert.strictEqual(student.name, "John Doe");
    assert.strictEqual(student.age, 20);
    assert.strictEqual(student.group, 2);
  });

  test('should trim student name', () => {
    const student = new Student("1", "  John Doe  ", 20, 2);
    assert.strictEqual(student.name, "John Doe");
  });

  test('should floor student age', () => {
    const student = new Student("1", "John Doe", 20.7, 2);
    assert.strictEqual(student.age, 20);
  });

  test('should throw error for empty ID', () => {
    assert.throws(() => {
      new Student("", "John Doe", 20, 2);
    }, /ID must be a non-empty string/);
  });

  test('should throw error for null ID', () => {
    assert.throws(() => {
      new Student(null, "John Doe", 20, 2);
    }, /ID must be a non-empty string/);
  });

  test('should throw error for empty name', () => {
    assert.throws(() => {
      new Student("1", "", 20, 2);
    }, /name must be a non-empty string/);
  });

  test('should throw error for null name', () => {
    assert.throws(() => {
      new Student("1", null, 20, 2);
    }, /name must be a non-empty string/);
  });

  test('should throw error for age > 150', () => {
    assert.throws(() => {
      new Student("1", "John Doe", 200, 2);
    }, /age must be between/);
  });

  test('should throw error for age < 1', () => {
    assert.throws(() => {
      new Student("1", "John Doe", 0, 2);
    }, /age must be between/);
  });

  test('should throw error for null group', () => {
    assert.throws(() => {
      new Student("1", "John Doe", 20, null);
    }, /group must be specified/);
  });

  test('should throw error for undefined group', () => {
    assert.throws(() => {
      new Student("1", "John Doe", 20, undefined);
    }, /group must be specified/);
  });

  return { passed, failed };
}

if (require.main === module) {
  const result = runTests();
  console.log(`\nStudent tests: ${result.passed} passed, ${result.failed} failed`);
  process.exit(result.failed > 0 ? 1 : 0);
}

module.exports = runTests;
