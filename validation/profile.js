const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  // validate handle field
  data.handle = !isEmpty(data.handle) ? data.handle : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle must be between 2 to 40 character";
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = "Handle field id required";
  }

  // validate skills field
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (validator.isEmpty(data.skills)) {
    errors.skills = "skills field id required";
  }

  // validate status field
  data.status = !isEmpty(data.status) ? data.status : "";

  if (validator.isEmpty(data.status)) {
    errors.status = "status field id required";
  }

  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not a valid url";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid url";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid url";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid url";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid url";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid url";
    }
  }

  return { errors, isValid: isEmpty(errors) };
};
