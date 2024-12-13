import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    name: String,
    participants: [String],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ChatRoom =
  mongoose.models.ChatRoom || mongoose.model("ChatRoom", ChatRoomSchema);
export default ChatRoom;
