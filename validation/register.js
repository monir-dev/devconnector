const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // validate name field
  data.name = !isEmpty(data.name) ? data.name : "";

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 to 30 character";
  }

  if (validator.isEmpty(data.name)) {
    errors.name = "Name field id required";
  }

  // validate email field
  data.email = !isEmpty(data.email) ? data.email : "";

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field id required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Invalid Email";
  }

  // validate password field
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field id required";
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 to 30 character";
  }

  // validate confirm password field
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field id required";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return { errors, isValid: isEmpty(errors) };
};
