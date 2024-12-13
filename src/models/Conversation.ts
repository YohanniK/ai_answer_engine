import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
    sender: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
export default Conversation;
