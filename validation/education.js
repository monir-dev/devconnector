const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  // validate school field
  data.school = !isEmpty(data.school) ? data.school : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "school field id required";
  }

  // validate degree field
  data.degree = !isEmpty(data.degree) ? data.degree : "";

  if (validator.isEmpty(data.degree)) {
    errors.degree = "degree field id required";
  }

  // validate fieldofstudy field
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";

  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "fieldofstudy field id required";
  }

  // validate from field
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.from)) {
    errors.from = "from date field id required";
  }

  return { errors, isValid: isEmpty(errors) };
};
