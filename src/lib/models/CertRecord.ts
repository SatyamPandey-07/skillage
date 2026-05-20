import mongoose, { Schema } from "mongoose";

const certSchema = new Schema(
  {
    learner: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    score: { type: Number, min: 80, max: 100 },
    txHash: { type: String, unique: true },
    tokenId: { type: Number },
    mintedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

certSchema.index({ learner: 1, mintedAt: -1 });

export const CertRecord =
  mongoose.models.CertRecord ?? mongoose.model("CertRecord", certSchema);
