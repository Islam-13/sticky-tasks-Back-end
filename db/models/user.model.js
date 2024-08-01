import { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/helpers.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minLength: [3, "Must at least 3 chars"],
      maxLength: [15, "Must AT most 15 chars"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minLength: [3, "Must at least 3 chars"],
      maxLength: [15, "Must AT most 15 chars"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      minLength: [6, "Must at least 6 chars"],
      // maxLength: [15, "Must at most 15 chars"],
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    loggedin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: "user",
    },
    phone: String,
    otp: String,
    expiredToken: Date,
  },
  { timestamps: true, versionKey: false }
);

const userModel = model("user", userSchema);

export default userModel;
