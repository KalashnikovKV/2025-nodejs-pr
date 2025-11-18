const constants = require('./constants');
const { createValidationError } = require('./errors');

function validateId(id) {
  if (!id || typeof id !== 'string') {
    throw createValidationError('ID_MUST_BE_STRING');
  }
}

function validateName(name) {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw createValidationError('NAME_MUST_BE_STRING');
  }
  if (name.trim().length > constants.MAX_NAME_LENGTH) {
    throw createValidationError('NAME_TOO_LONG', constants.MAX_NAME_LENGTH);
  }
  return name.trim();
}

function validateAge(age) {
  if (typeof age !== 'number' || isNaN(age)) {
    throw createValidationError('AGE_MUST_BE_NUMBER');
  }
  if (age < constants.MIN_AGE || age > constants.MAX_AGE) {
    throw createValidationError('AGE_OUT_OF_RANGE', constants.MIN_AGE, constants.MAX_AGE);
  }
  return Math.floor(age);
}

function validateGroup(group) {
  if (group === undefined || group === null) {
    throw createValidationError('GROUP_MUST_BE_SPECIFIED');
  }
  if (typeof group === 'string' && group.trim().length === 0) {
    throw createValidationError('GROUP_CANNOT_BE_EMPTY');
  }
  return group;
}

function validateStudentData(id, name, age, group) {
  validateId(id);
  const validatedName = validateName(name);
  const validatedAge = validateAge(age);
  const validatedGroup = validateGroup(group);
  
  return {
    id,
    name: validatedName,
    age: validatedAge,
    group: validatedGroup
  };
}

function validateStudentDataWithoutId(name, age, group) {
  const validatedName = validateName(name);
  const validatedAge = validateAge(age);
  const validatedGroup = validateGroup(group);
  
  return {
    name: validatedName,
    age: validatedAge,
    group: validatedGroup
  };
}

module.exports = {
  validateId,
  validateName,
  validateAge,
  validateGroup,
  validateStudentData,
  validateStudentDataWithoutId
};

