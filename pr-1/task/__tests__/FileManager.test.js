const assert = require('assert');
const fs = require('fs');
const path = require('path');
const FileManager = require('../services/FileManager');

const TEST_FILE_PATH = path.join(__dirname, 'test_students.json');

function runTests() {
  console.log('Running FileManager tests...');
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

  function afterEach(fn) {
    try {
      fn();
    } catch (error) {
    }
  }

  test('should save data to JSON file', () => {
    const testData = [{ id: "1", name: "John Doe", age: 20, group: 2 }];
    
    FileManager.saveToJSON(testData, TEST_FILE_PATH);
    assert.strictEqual(fs.existsSync(TEST_FILE_PATH), true);
    
    const content = fs.readFileSync(TEST_FILE_PATH, 'utf8');
    const parsed = JSON.parse(content);
    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].name, "John Doe");
    
    afterEach(() => {
      if (fs.existsSync(TEST_FILE_PATH)) {
        fs.unlinkSync(TEST_FILE_PATH);
      }
    });
  });

  test('should load data from JSON file', () => {
    const testData = [
      { id: "1", name: "John Doe", age: 20, group: 2 },
      { id: "2", name: "Jane Smith", age: 23, group: 3 }
    ];
    
    FileManager.saveToJSON(testData, TEST_FILE_PATH);
    const loaded = FileManager.loadJSON(TEST_FILE_PATH);
    
    assert.strictEqual(loaded.length, 2);
    assert.strictEqual(loaded[0].name, "John Doe");
    assert.strictEqual(loaded[1].name, "Jane Smith");
    
    afterEach(() => {
      if (fs.existsSync(TEST_FILE_PATH)) {
        fs.unlinkSync(TEST_FILE_PATH);
      }
    });
  });

  test('should return empty array for non-existent file', () => {
    const empty = FileManager.loadJSON(TEST_FILE_PATH);
    assert.strictEqual(Array.isArray(empty), true);
    assert.strictEqual(empty.length, 0);
  });

  test('should throw error for invalid JSON format', () => {
    fs.writeFileSync(TEST_FILE_PATH, 'invalid json{', 'utf8');
    
    assert.throws(() => {
      FileManager.loadJSON(TEST_FILE_PATH);
    }, /Invalid JSON format/);
    
    afterEach(() => {
      if (fs.existsSync(TEST_FILE_PATH)) {
        fs.unlinkSync(TEST_FILE_PATH);
      }
    });
  });

  test('should throw error for non-array data', () => {
    fs.writeFileSync(TEST_FILE_PATH, '{"not": "array"}', 'utf8');
    
    assert.throws(() => {
      FileManager.loadJSON(TEST_FILE_PATH);
    }, /valid array/);
    
    afterEach(() => {
      if (fs.existsSync(TEST_FILE_PATH)) {
        fs.unlinkSync(TEST_FILE_PATH);
      }
    });
  });

  test('should handle empty file', () => {
    fs.writeFileSync(TEST_FILE_PATH, '', 'utf8');
    
    const empty = FileManager.loadJSON(TEST_FILE_PATH);
    assert.strictEqual(Array.isArray(empty), true);
    assert.strictEqual(empty.length, 0);
    
    afterEach(() => {
      if (fs.existsSync(TEST_FILE_PATH)) {
        fs.unlinkSync(TEST_FILE_PATH);
      }
    });
  });

  afterEach(() => {
    try {
      if (fs.existsSync(TEST_FILE_PATH)) {
        fs.unlinkSync(TEST_FILE_PATH);
      }
    } catch (error) {
    }
  });

  return { passed, failed };
}

if (require.main === module) {
  const result = runTests();
  console.log(`\nFileManager tests: ${result.passed} passed, ${result.failed} failed`);
  process.exit(result.failed > 0 ? 1 : 0);
}

module.exports = runTests;
