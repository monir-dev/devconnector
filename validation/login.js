const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // validate email field
  data.email = !isEmpty(data.email) ? data.email : "";

  if (!validator.isEmail(data.email)) {
    errors.email = "Invalid Email";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field id required";
  }

  // validate password field
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 to 30 character";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field id required";
  }

  return { errors, isValid: isEmpty(errors) };
};
