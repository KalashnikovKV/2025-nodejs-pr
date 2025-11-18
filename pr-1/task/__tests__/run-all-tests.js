const fs = require('fs');
const path = require('path');

const testsDir = __dirname;
const testFiles = fs.readdirSync(testsDir)
  .filter(file => file.endsWith('.test.js') && file !== 'run-all-tests.js')
  .map(file => path.join(testsDir, file));

let totalPassed = 0;
let totalFailed = 0;
const results = [];

console.log('Running all tests...\n');

for (const testFile of testFiles) {
  try {
    const runTests = require(testFile);
    const result = runTests();
    totalPassed += result.passed;
    totalFailed += result.failed;
    results.push({ file: path.basename(testFile), ...result });
  } catch (error) {
    console.error(`Error running ${path.basename(testFile)}: ${error.message}`);
    totalFailed++;
  }
}

console.log('Test Summary:');

for (const result of results) {
  const status = result.failed === 0 ? 'PASS' : 'FAIL';
  console.log(`${status} ${result.file}: ${result.passed} passed, ${result.failed} failed`);
}

console.log(`Total: ${totalPassed} passed, ${totalFailed} failed`);

process.exit(totalFailed > 0 ? 1 : 0);

