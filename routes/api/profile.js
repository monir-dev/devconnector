const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// load user model
const User = require("../../models/User");

// load Profile model
const Profile = require("../../models/Profile");

// load input validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// @route  GET api/profile
// @desc   Get current user profile
// @access Private
router.get("/", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate("user", ["name", "email", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route  POST api/profile
// @desc   Create or Edit User Profile
// @access Private
router.post("/", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  const { errors, isValid } = validateProfileInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(404).json(errors);
  }

  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;

  // Skills spilt into array
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",");
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  // Insert or Update Operation
  Profile.findOne({ user: req.user.id }).then(profile => {
    console.log(profile);
    if (profile) {
      // Update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      )
        .then(profile => res.json(profile))
        .catch(err => console.log(err));
    } else {
      // Create

      // Check if handle exist
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if (profile) {
          errors.handle = "That handle already exists";
          return res.status(404).json(errors);
        }

        // Save profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      });
    }
  });
});

// @route  DELETE api/profile
// @desc   DELETE user and profile
// @access Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

// @route  GET api/profile/all
// @desc   Get all users profile
// @access Public
router.get("/all", function(req, res) {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "email", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json(errors));
});

// @route  GET api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public
router.get("/handle/:handle", function(req, res) {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "email", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(errors));
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user_id
// @access Public
router.get("/user/:user_id", function(req, res) {
  const errors = {};
  // return res.json({ id: req.params.user_id });
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "email", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(errors));
});

// @route  POST api/profile/experience
// @desc   Add experience to the profile
// @access Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(404).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to experience array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route  DELETE api/profile/experience/:exp_id
// @desc   Revove an experience from profile
// @access Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      // Splice out of the array
      profile.experience.splice(removeIndex, 1);

      // save
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route  POST api/profile/education
// @desc   Add education to the profile
// @access Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(404).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to experience array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route  DELETE api/profile/education/:edu_id
// @desc   Revove an education from profile
// @access Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      // Splice out of the array
      profile.education.splice(removeIndex, 1);

      // save
      profile.save().then(profile => res.json(profile));
    });
  }
);

module.exports = router;
