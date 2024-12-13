import mongoose from "mongoose";

const ScrapedDataSchema = new mongoose.Schema(
  {
    url: String,
    title: String,
    description: String,
    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ScrapedData =
  mongoose.models.ScrapedData ||
  mongoose.model("ScrapedData", ScrapedDataSchema);

export default ScrapedData;
