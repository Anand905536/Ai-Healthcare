import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";



export const uploadProfilePicture = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No profile picture uploaded", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profilePicture: req.file.path },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Profile picture uploaded successfully",
    profilePicture: user.profilePicture,
  });
});



export const updateProfile = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (name) user.name = name;
  if (email) user.email = email;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});



export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset token generated",
    resetToken, // will be emailed later
  });
});


export const resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) {
    return next(new AppError("Password is required", 400));
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});
