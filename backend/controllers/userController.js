import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Register new user
//@route           POST /api/users/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @desc    GET user profile
// @route   GET /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    console.log("in forgot pwd");
    let user1 = await User.findOne({ email: req.body.email });
    console.log("USER: ", user1);
    if (user1) {
      console.log("user.email = ", user1.email === null);
      user1 ? console.log(user1) : null;
    }
    if (!user1) {
      console.log("USER NOT FOUND IN DB");

      res.json({ msg: "USER NOT FOUND", status: 0 });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "naikadvait1610@gmail.com",
        pass: "kkncvfrgwdsalniv",
      },
    });

    let randomPass = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let counter = 0; counter < 10; counter++)
      randomPass += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );

    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(randomPass, salt);

    const mailOptions = {
      from: "naikadvait1610@gmail.com",
      to: req.body.email,
      subject: "Your password has beeen reset",
      text: `Your new password is ${randomPass}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json({ error, status: 0 });
      } else {
        res.json({ msg: "Email sent: " + info.response, status: 1});
      }
    });

    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { password: encryptedPass }
    );
    // } else {
    //   res.status(401);
    //   throw new Error("Invalid Email");
    // }
  } catch (e) {
    console.log(e);
  }
});

export { authUser, updateUserProfile, registerUser, forgotPassword };
