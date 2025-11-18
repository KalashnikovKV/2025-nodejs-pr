const validator = require('./validator');
const { createCLIError } = require('./errors');

function parseCLIArguments() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const quiet = args.includes('--quiet');
  
  if (verbose && quiet) {
    throw createCLIError('VERBOSE_QUIET_CONFLICT');
  }
  
  const addIndex = args.indexOf('--add');
  let addStudent = null;
  if (addIndex !== -1) {
    if (args.length <= addIndex + 3) {
      throw createCLIError('ADD_REQUIRES_ARGS');
    }
    
    const name = args[addIndex + 1];
    const age = parseInt(args[addIndex + 2], 10);
    const group = args[addIndex + 3];
    
    try {
      const validated = validator.validateStudentDataWithoutId(name, age, group);
      addStudent = validated;
    } catch (error) {
      throw createCLIError('INVALID_STUDENT_DATA', error.message);
    }
  }
  
  return { verbose, quiet, addStudent };
}

module.exports = parseCLIArguments;

