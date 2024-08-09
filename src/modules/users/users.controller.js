import userModel from "../../../db/models/user.model.js";
import sendEmail from "../../services/sendEmail.js";
import { AppError, asyncHandler } from "../../utils/helpers.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (user) return next(new AppError("Email already exists", 409));

  const token = jwt.sign({ email }, process.env.signupKey, {
    expiresIn: 60 * 60 * 3,
  });
  const resendToken = jwt.sign({ email }, process.env.signupKey);
  const html = `
        <h1>Hello ${firstName},</h1>
        <p>Thank you for signing up with us. Please click on the link below to confirm your email.</p>
        <a href="${req.protocol}://${req.headers.host}/users/confirm/${token}">Confirm Email</a>
        <br>
        <a href="${req.protocol}://${req.headers.host}/users/resend/${resendToken}">Resend Confirmation Email</a>
  `;

  const checkSendEmail = await sendEmail(email, "Confirm Email", html);
  if (!checkSendEmail) return next(new AppError("Error sending email", 500));

  const hashed = bcrypt.hashSync(password, parseInt(process.env.saltRounds));

  const newUser = await userModel.create({ ...req.body, password: hashed });

  if (!newUser) next(new AppError("Error creating user", 500));

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newUser,
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const email = jwt.decode(token, process.env.signupKey)?.email;
  if (!email) return next(new AppError("Invalid token", 400));

  const user = await userModel.findOneAndUpdate(
    { email, confirmed: false },
    { confirmed: true },
    { new: true }
  );

  if (!user)
    return next(new AppError("User not found or already confirmed", 400));

  res.status(200).json({
    status: "success",
    message: "Email confirmed successfully",
  });
});

export const resendConfirmEmail = asyncHandler(async (req, res, next) => {
  const { resendToken } = req.params;

  const email = jwt.decode(resendToken, process.env.signupKey)?.email;
  if (!email) return next(new AppError("Invalid token", 400));

  const user = await userModel.findOne({ email, confirmed: false });

  if (!user)
    return next(new AppError("User not found or already confirmed", 400));

  const token = jwt.sign({ email }, process.env.signupKey, {
    expiresIn: 60 * 60 * 3,
  });

  const html = `
        <h1>Hello ${user.firstName},</h1>
        <p>Thank you for signing up with us. This is a resent code for you.</p>
        <p>Please click on the link below to confirm your email.</p>
        <a href="${req.protocol}://${req.headers.host}/users/confirm/${token}">Confirm Email</a>
  `;

  const checkSendEmail = await sendEmail(email, "Confirm Email", html);
  if (!checkSendEmail) return next(new AppError("Error sending email", 500));

  res.status(200).json({
    status: "success",
    message: "Confirmation email resent successfully",
  });
});

export const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password))
    return next(new AppError("Email or password is incorrect", 401));

  if (!user.confirmed)
    return next(
      new AppError("Email not verified yet, please confirm email", 400)
    );

  const token = jwt.sign({ id: user._id, email }, process.env.signinKey);

  user.loggedin = true;
  await user.save();

  res.status(201).json({
    status: "success",
    message: "User logged in successfully",
    token,
  });
});

export const signout = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id, loggedin: true },
    { expiredToken: Date.now(), loggedin: false }
  );

  if (!user)
    return next(new AppError("User not found or already logged out", 400));

  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const otp = customAlphabet("0123456789", 6)();

  const user = await userModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { otp }
  );
  if (!user) return next(new AppError("Email is not exist", 404));

  const html = `
          <p>To reset your password.</p>
          <p>Submit this reset password code : ${otp}. If you did not request a change of password, please ignore this email!</p>
  `;

  const checkSendEmail = await sendEmail(email, "Reset password code", html);
  if (!checkSendEmail) return next(new AppError("Error sending email", 500));

  res.status(201).json({ status: "success" });
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;

  const user = await userModel.findOneAndUpdate({ otp }, { otp: "" });

  if (!user || otp == "")
    return next(new AppError("Incorrect or expired code."));

  const verifyToken = jwt.sign({ _id: user._id }, process.env.verifyEmailKey);

  res.status(201).json({ status: "success", verifyToken });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { verifytoken } = req.headers;
  const { password } = req.body;

  const _id = jwt.decode(verifytoken, process.env.verifyEmailKey)?._id;

  const hashed = bcrypt.hashSync(password, parseInt(process.env.saltRounds));

  const user = await userModel.findOneAndUpdate(
    { _id },
    { password: hashed, otp: "", expiredToken: Date.now() }
  );

  if (!_id || !user) return next(new AppError("Ivalid verify token."));

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.signinKey
  );

  user.loggedin = true;
  await user.save();

  res.status(201).json({ status: "success", token });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);

  if (!user) return next(new AppError("User not found"));

  res.status(201).json({ status: "success", user });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    req.body,
    { new: true }
  );

  if (!user) return next(new AppError("User not found"));

  res
    .status(201)
    .json({ status: "success", message: "Profile updated successfully", user });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  const hashed = bcrypt.hashSync(password, process.env.saltRounds);

  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { password: hashed }
  );

  if (!user) return next(new AppError("User not found"));

  res.status(201).json({
    status: "success",
    message: "Password changed successfully",
  });
});
