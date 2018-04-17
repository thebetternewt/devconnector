const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Set initial values for data validation.
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password_confirmation = !isEmpty(data.password_confirmation)
    ? data.password_confirmation
    : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters.';
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required.';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required.';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid.';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 100 })) {
    errors.password = 'Password must be at least 6 characters.';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required.';
  }
  if (Validator.isEmpty(data.password_confirmation)) {
    errors.password_confirmation = 'Confirm Password field is required.';
  }
  if (!Validator.equals(data.password, data.password_confirmation)) {
    errors.password_confirmation = 'Passwords must match.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
