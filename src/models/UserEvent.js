import mongoose from "mongoose";

const userEventSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    type: {
      type: String,
      enum: ["view", "cart", "purchase"],
      required: true
    }
  },
  { timestamps: true }
);

export const UserEvent = mongoose.model("UserEvent", userEventSchema);
