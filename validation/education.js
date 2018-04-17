const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  // Set initial values for data validation.
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.field_of_study = !isEmpty(data.field_of_study)
    ? data.field_of_study
    : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = 'School field is required.';
  }
  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree name field is required.';
  }
  if (Validator.isEmpty(data.field_of_study)) {
    errors.field_of_study = 'Field of study field is required.';
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date field is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
