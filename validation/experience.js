const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  // validate title field
  data.title = !isEmpty(data.title) ? data.title : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "title field id required";
  }

  // validate company field
  data.company = !isEmpty(data.company) ? data.company : "";

  if (validator.isEmpty(data.company)) {
    errors.company = "company field id required";
  }

  // validate from field
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.from)) {
    errors.from = "from date field id required";
  }

  return { errors, isValid: isEmpty(errors) };
};
