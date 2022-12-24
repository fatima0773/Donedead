import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";
import { google } from "googleapis";
import { randomBytes } from "crypto";

const OAuth2 = google.auth.OAuth2;

import User from "../models/user.js";
import Token from "../models/token.js";

export const getAll = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, vatID } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      vatID,
      balance: 0,
      coins: 0,
      verified: false,
      timestamp: Date.now(),
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.SECRET
    );
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getProfile = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated" });

  try {
    const {
      _id,
      firstName,
      lastName,
      email,
      balance,
      coins,
      paypal,
      bankDetails,
      verified,
      vatID,
      billing,
      timestamp,
    } = await User.findById(req.userId);

    res.status(200).json({
      _id,
      firstName,
      lastName,
      email,
      balance,
      coins,
      paypal,
      bankDetails,
      verified,
      vatID,
      billing,
      timestamp,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getProfilebyAdmin = async (req, res) => {
  const { id } = req.query;

  try {
    const {
      _id,
      firstName,
      lastName,
      email,
      balance,
      coins,
      paypal,
      bankDetails,
      verified,
      vatID,
      billing,
      timestamp,
    } = await User.findById(id);

    res.status(200).json({
      _id,
      firstName,
      lastName,
      email,
      balance,
      coins,
      paypal,
      bankDetails,
      verified,
      vatID,
      billing,
      timestamp,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateBilling = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated" });

  try {
    const billing = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { billing },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.body;
    const h = await User.findByIdAndUpdate(user._id, user, { new: true });
    res.status(200).json(h);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User doesn't exist." });

    let token = await Token.findOne({ userEmail: user.email });

    if (!token) {
      token = await Token.create({
        userEmail: user.email,
        token: randomBytes(3).toString("hex"),
      });
    }

    // const link = `https://dondead-frontend.uc.r.appspot.com/password-reset/${user.email}/${token.token}`;

    const oauth2Client = new OAuth2(
      process.env.Client_ID,
      process.env.Client_Secret,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.Refresh_Token,
    });

    const accessToken = oauth2Client.getAccessToken();

    var transporter = createTransport({
      service: "gmail",
      // host: "smtp.gmail.com",
      // port: 587,
      // secure: true,
      auth: {
        type: "OAuth2",
        user: "sales@dondead.com",
        clientId: process.env.Client_ID,
        clientSecret: process.env.Client_Secret,
        refreshToken: process.env.Refresh_Token,
        accessToken: accessToken,
      },
    });

    var mailOptions = {
      from: "sales@dondead.com",
      to: user.email,
      subject: "Password Reset",
      html: `<h1>Password Rest Link</h1><p>The code for reseting your password is as follows: ${token}</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "Email for password reset sent." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const checkToken = async (req, res) => {
  try {
    const { token } = req.body;

    const tokenn = await Token.findOne({ token });

    if (!tokenn) res.status(404).json({ message: "Token Invalid" });

    res.status(200).json({ message: "Token Valid" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    let user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User doesn't exist." });

    let tokenn = await Token.findOne({ token });

    if (!tokenn) res.status(404).json({ message: "Token Invalid" });

    user = await User.findByIdAndUpdate(user._id, { password }, { new: true });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
