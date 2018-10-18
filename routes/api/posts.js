const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// load models
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// load input validation
const validatePostInput = require("../../validation/post");

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(404).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route  GET api/posts
// @desc   Fetch all posts
// @access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostsfound: "No posts found with that id" })
    );
});

// @route  GET api/posts/:id
// @desc   Find a post
// @access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that id" })
    );
});

// @route  DELETE api/posts/:id
// @desc   Delete a post
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "user not authrized" });
          }

          // Delete the post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.json({ postnotfound: "No post found" }));
    });
  }
);

// @route  POST api/posts/like/:id
// @desc   Like post
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if user already liked that post
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "user already liked this post" });
          }

          // Add user id to likes array
          post.likes.push({ user: req.user.id });

          // Save post
          post.save().then(post => res.json(post));
        })
        .catch(err => res.json({ postnotfound: "No post found" }));
    });
  }
);

// @route  POST api/posts/unlike/:id
// @desc   Unlike post
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if user already liked that post
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }

          // get remove index
          const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);

          // Splice out of the array
          post.likes.splice(removeIndex, 1);

          // Save post
          post.save().then(post => res.json(post));
        })
        .catch(err => res.json({ postnotfound: "No post found" }));
    });
  }
);

// @route  POST api/posts/comment/:id
// @desc   Comment to a post
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(404).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newCommant = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // add to comment array
        post.comments.unshift(newCommant);

        // Save post
        post.save().then(post => res.json(post));
      })
      .catch(err => res.json({ postnotfound: "No post found" }));
  }
);

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Remove comment from posts
// @access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // check if comment exist
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "comment not exists" });
        }

        // get remove index
        const removeIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of the array
        post.comments.splice(removeIndex, 1);

        // Save post
        post.save().then(post => res.json(post));
      })
      .catch(err => res.json({ postnotfound: "No post found" }));
  }
);
module.exports = router;
