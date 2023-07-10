// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

module.exports = {
  Query: {
    // get a single user by either their id or their username
    async getSingleUser(_, { id, username }, { res }) {
      const foundUser = await User.findOne({
        $or: [{ _id: id }, { username }],
      });

      if (!foundUser) {
        throw new Error('Cannot find a user with this id!');
      }

      return foundUser;
    },
  },

  Mutation: {
    // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
    async createUser(_, input, { res }) {
      console.log(input);
      const user = await User.create(input);

      if (!user) {
        throw new Error('Something is wrong!');
      }

      const token = signToken(user);
      return { token, user };
    },

    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    async login(_, input, { res }) {
      const user = await User.findOne({ $or: [{ username: input.username }, { email: input.email }] });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = user.isCorrectPassword(input.password);

      if (!correctPw) {
        throw new Error('Wrong password!');
      }

      const token = signToken(user);
      return { token, user };
    },

    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    async saveBook(_, { input }, { user, res }) {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new Error('An error occurred while saving the book.');
      }
    },

    // remove a book from `savedBooks`
    async deleteBook(_, { bookId }, { user, res }) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }

      return updatedUser;
    },
  },
};