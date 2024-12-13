import {
  createChatRoom,
  deleteChatRoom,
  getAllChatRooms,
  getChatRoom,
} from "@/services/chatRoomService";

export async function POST(req: Request) {
  const { name, participants } = await req.json();

  const chatRoom = await createChatRoom(name, participants);
  return new Response(JSON.stringify(chatRoom), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: Request) {
  try {
    const chatRooms = await getAllChatRooms();
    return new Response(JSON.stringify(chatRooms), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error("Failed to fetch chat rooms");
  }
}

export async function DELETE(req: Request) {
  const { chatRoomId } = await req.json();
  const deletedRoom = await deleteChatRoom(chatRoomId);

  return new Response(JSON.stringify(deletedRoom), {
    headers: { "Content-Type": "application/json" },
  });
}
