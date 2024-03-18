const User = require("../models/User2");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide name,email and password");
  }

  // Use middlewar PRE from Moongosse
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // const tempUser = {
  //   name,
  //   email,
  //   password: hashedPassword,
  // };

  const user = await User.create({ ...req.body });

  // Use methods from Moongosse
  // const token = jwt.sign(
  //   { userId: user._id, name: user.name },
  //   process.env.JWT_SECRET,
  //   { expiresIn: "30d" }
  // );

  // res.status(StatusCodes.CREATED).json({
  //   user: { name: user.getName() },
  //   token
  // });

  const token = user.creatJWT();
  res.status(StatusCodes.CREATED).json({
    user: { name: user.getName() },
    token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide emeail and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");

  }

  const token = user.creatJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.getName() }, token });
};

module.exports = {
  register,
  login,
};
