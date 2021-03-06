const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post Model
const Post = require('../../models/Post');
// Profile Model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'Posts works!' }));

// @route  GET api/posts/
// @desc   Get all posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({ no_posts_found: 'No posts found.' }));
});

// @route  GET api/posts/:id
// @desc   Get post by id
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      res.json(post);
    })
    .catch(err => res.status(404).json({ post_not_found: 'Post not found.' }));
});

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
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

// @route  DELETE api/posts/:id
// @desc   Delete post
// @access Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id).then(post => {
      // Check for post owner
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ not_authorized: 'User not authorized.' });
      }
      post
        .remove()
        .then(() => res.json({ success: true }))
        .catch(err =>
          res.status(404).json({ no_post_found: 'No post found.' })
        );
    });
  }
);

// @route  POST api/posts/like/:id
// @desc   Like post
// @access Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check if user has already liked post
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ already_liked: 'User already liked this post.' });
        }

        // Add user id to likes array
        post.likes.push({ user: req.user.id });

        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ post_not_found: 'Post not found.' })
      );
  }
);

// @route  POST api/posts/unlike/:id
// @desc   Unlike post
// @access Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check if user has already liked post
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ not_liked: 'You have not yet liked this post.' });
        }

        // Get remove index
        const removeIndex = post.likes
          .map(like => like.user.toString())
          .indexOf(req.user.id);

        // Splice out of array
        post.likes.splice(removeIndex, 1);

        // Save post
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ post_not_found: 'Post not found.' })
      );
  }
);

// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add new comment to array
        post.comments.push(newComment);

        // Save post
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ post_not_found: 'Post not found.' })
      );
  }
);

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Remove comment from post
// @access Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Filter comments for array containing requested comment
        const commentArray = post.comments.filter(
          comment => comment._id.toString() === req.params.comment_id
        );

        // Check if comment exists
        if (commentArray.length === 0) {
          return res
            .status(404)
            .json({ comment_not_exists: 'Comment does not exist.' });
        }
        // Check if comment belongs to current user
        const commentOwner = commentArray.map(comment =>
          comment.user.toString()
        )[0];
        if (req.user.id !== commentOwner) {
          return res.status(403).json({
            unauthorized: 'User not authorized to delete this comment.'
          });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);

        // Remove comment from array
        post.comments.splice(removeIndex, 1);

        // Save post
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ post_not_found: 'Post not found.' })
      );
  }
);

module.exports = router;
