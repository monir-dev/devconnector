const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  // validate email field
  data.text = !isEmpty(data.text) ? data.text : "";

  if (!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "text must be between 6 to 30 character";
  }

  if (validator.isEmpty(data.text)) {
    errors.text = "text field id required";
  }

  return { errors, isValid: isEmpty(errors) };
};
