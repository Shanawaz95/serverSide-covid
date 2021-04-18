const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../../config");
const { UserInputError } = require("apollo-server");
const {
  registerValidation,
  loginValidation,
} = require("../../validation/validate");

function tokenGenerator(data) {
  return jwt.sign(
    {
      id: data.id,
      email: data.email,
      userName: data.userName,
    },
    SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { isValid, errors } = loginValidation(username, password);

      if (!isValid) {
        throw new UserInputError("error occured", { errors });
      }
      const user = await User.findOne({ userName: username });

      if (!user) {
        errors.general =
          "can't find any user by this name. Try registering if you're new here!!!";
        throw new UserInputError("user not found", { errors });
      }

      const passMatch = await bcrypt.compare(password, user.password);

      if (!passMatch) {
        errors.general = "Try to remember your password.";
        throw new UserInputError("wrong password", { errors });
      }

      const token = tokenGenerator(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { userName, password, confirmPassword, email } }
    ) {
      const { errors, isValid } = registerValidation(
        userName,
        password,
        confirmPassword,
        email
      );
      if (!isValid) {
        throw new UserInputError("error occured", { errors });
      }

      const user = await User.findOne({ userName });

      if (user) {
        throw new UserInputError(
          "found someone with the same user name! Try changing yours...",
          {
            errors: {
              userName: "userName is taken",
            },
          }
        );
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        userName,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = tokenGenerator(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
