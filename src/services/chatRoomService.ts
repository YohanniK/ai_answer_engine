import connectDB from "@/lib/database";
import ChatRoom from "../models/ChatRoom";

export async function createChatRoom(
  name: string,
  // TODO: Check list of participants one more time
  participants: ["system", "assistant", "user"]
) {
  await connectDB();
  const chatRoom = new ChatRoom({ name, participants });
  return chatRoom.save();
}

export async function getChatRoom(chatRoomId: string) {
  await connectDB();
  return ChatRoom.findById(chatRoomId);
}

export async function getAllChatRooms() {
  await connectDB();
  return ChatRoom.find();
}

export async function deleteChatRoom(chatRoomId: string) {
  await connectDB();
  return ChatRoom.findByIdAndDelete(chatRoomId);
}
