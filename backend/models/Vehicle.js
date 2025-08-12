import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", VehicleSchema);
