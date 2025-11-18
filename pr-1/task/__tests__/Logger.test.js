const assert = require('assert');
const Logger = require('../utils/Logger');

function runTests() {
  console.log('Running Logger tests...');
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

  function afterEach(fn) {
    fn();
  }

  test('should suppress output in quiet mode', () => {
    const logger = new Logger(false, true);
    let logCalled = false;
    const originalLog = console.log;
    
    console.log = () => {
      logCalled = true;
    };
    
    logger.log('Test message');
    assert.strictEqual(logCalled, false);
    
    console.log = originalLog;
  });

  test('should log in normal mode', () => {
    const logger = new Logger(false, false);
    let logCalled = false;
    let logMessage = '';
    const originalLog = console.log;
    
    console.log = (...args) => {
      logCalled = true;
      logMessage = args.join(' ');
    };
    
    logger.log('Test message');
    assert.strictEqual(logCalled, true);
    assert.strictEqual(logMessage, 'Test message');
    
    console.log = originalLog;
  });

  test('should log system info in verbose mode', () => {
    const logger = new Logger(true, false);
    let logCalls = [];
    const originalLog = console.log;
    
    console.log = (...args) => {
      logCalls.push(args.join(' '));
    };
    
    logger.log('Test message');
    
    assert.strictEqual(logCalls.length > 1, true);
    assert.strictEqual(logCalls[0], 'Test message');
    assert.strictEqual(logCalls.some(msg => msg.includes('Timestamp')), true);
    assert.strictEqual(logCalls.some(msg => msg.includes('Platform')), true);
    assert.strictEqual(logCalls.some(msg => msg.includes('Memory')), true);
    assert.strictEqual(logCalls.some(msg => msg.includes('CPU')), true);
    
    console.log = originalLog;
  });

  test('should not log in quiet mode even with verbose', () => {
    const logger = new Logger(true, true);
    let logCalled = false;
    const originalLog = console.log;
    
    console.log = () => {
      logCalled = true;
    };
    
    logger.log('Test message');
    assert.strictEqual(logCalled, false);
    
    console.log = originalLog;
  });

  return { passed, failed };
}

if (require.main === module) {
  const result = runTests();
  console.log(`\nLogger tests: ${result.passed} passed, ${result.failed} failed`);
  process.exit(result.failed > 0 ? 1 : 0);
}

module.exports = runTests;
