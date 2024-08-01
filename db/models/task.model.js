import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [3, "Must at least 3 chars"],
      maxLength: [100, "Must AT most 100 chars"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "priority is required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    category: {
      type: String,
      enum: ["personal", "work", "occasions", "others"],
      required: [true, "category is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User id is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

const taskModel = model("task", taskSchema);

export default taskModel;
