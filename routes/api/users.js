const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register users
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid Email').isEmail(),
    check(
      'password',
      'Please enter a password with minimum 6 characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get user gravatar
      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'mm', // default
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt Password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save(); // Save user to database. Once it's saved, we'll get an _id automatically from MongoDB

      // Return JWT
      const payload = {
        user: {
          id: user.id, // In mongoose, we don't need '_id' since it's processed by mongoose
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 86400 }, // 1 day
        (err, token) => {
          if (err) throw err;

          res.send({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
