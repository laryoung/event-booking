const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Mongoose Models
const User = require("../../models/user");

//User defined functions to query data

module.exports = {
  //Create User Resolver
  createUser: async (args) => {
    try {
      const user1 = await User.findOne({ email: args.userInput.email });
      if (user1) {
        throw new Error("User already exist");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const userSave = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await userSave.save();
      if (result) {
        //console.log(result);
        return { ...result._doc, password: null, _id: userSave.id };
      }
    } catch (error) {
      throw error;
    }
  },

  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("User does not exist");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Invalid Password");
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "SomeScreetKey",
        { expiresIn: "1h" }
      );
      return { userId: user.id, token: token, tokenExpiration: 1 };
    } catch (error) {
      throw error;
    }
  },
};
