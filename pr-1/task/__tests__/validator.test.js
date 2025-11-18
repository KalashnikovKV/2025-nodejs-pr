const assert = require('assert');
const validator = require('../utils/validator');

function runTests() {
  console.log('Running Validator tests...');
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

  test('should validate correct name', () => {
    const name = validator.validateName("John Doe");
    assert.strictEqual(name, "John Doe");
  });

  test('should trim name', () => {
    const name = validator.validateName("  John Doe  ");
    assert.strictEqual(name, "John Doe");
  });

  test('should throw error for empty name', () => {
    assert.throws(() => {
      validator.validateName("");
    }, /name must be a non-empty string/);
  });

  test('should throw error for null name', () => {
    assert.throws(() => {
      validator.validateName(null);
    }, /name must be a non-empty string/);
  });

  test('should validate correct age', () => {
    const age = validator.validateAge(20);
    assert.strictEqual(age, 20);
  });

  test('should floor age', () => {
    const age = validator.validateAge(20.7);
    assert.strictEqual(age, 20);
  });

  test('should throw error for age > 150', () => {
    assert.throws(() => {
      validator.validateAge(200);
    }, /age must be between/);
  });

  test('should throw error for age < 1', () => {
    assert.throws(() => {
      validator.validateAge(0);
    }, /age must be between/);
  });

  test('should throw error for non-number age', () => {
    assert.throws(() => {
      validator.validateAge("20");
    }, /age must be a number/);
  });

  test('should validate correct group', () => {
    const group = validator.validateGroup(2);
    assert.strictEqual(group, 2);
  });

  test('should validate string group', () => {
    const group = validator.validateGroup("3");
    assert.strictEqual(group, "3");
  });

  test('should throw error for null group', () => {
    assert.throws(() => {
      validator.validateGroup(null);
    }, /group must be specified/);
  });

  test('should throw error for empty group', () => {
    assert.throws(() => {
      validator.validateGroup("");
    }, /group cannot be empty/);
  });

  test('should validate correct ID', () => {
    assert.doesNotThrow(() => {
      validator.validateId("1");
    });
  });

  test('should throw error for empty ID', () => {
    assert.throws(() => {
      validator.validateId("");
    }, /ID must be a non-empty string/);
  });

  test('should throw error for null ID', () => {
    assert.throws(() => {
      validator.validateId(null);
    }, /ID must be a non-empty string/);
  });

  test('should validate complete student data', () => {
    const validated = validator.validateStudentData("1", "John Doe", 20, 2);
    assert.strictEqual(validated.id, "1");
    assert.strictEqual(validated.name, "John Doe");
    assert.strictEqual(validated.age, 20);
    assert.strictEqual(validated.group, 2);
  });

  test('should validate student data without ID', () => {
    const validated = validator.validateStudentDataWithoutId("John Doe", 20, 2);
    assert.strictEqual(validated.name, "John Doe");
    assert.strictEqual(validated.age, 20);
    assert.strictEqual(validated.group, 2);
    assert.strictEqual(validated.id, undefined);
  });

  return { passed, failed };
}

if (require.main === module) {
  const result = runTests();
  console.log(`\nValidator tests: ${result.passed} passed, ${result.failed} failed`);
  process.exit(result.failed > 0 ? 1 : 0);
}

module.exports = runTests;
