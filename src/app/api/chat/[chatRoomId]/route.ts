import { getConversation } from "@/services/chatService";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatRoomId: string }> }
) {
  const { chatRoomId } = await params;
  if (!chatRoomId) {
    return new Response("Chat Room ID not provided", { status: 400 });
  }

  try {
    const conversations = await getConversation(chatRoomId);
    return new Response(JSON.stringify(conversations), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Error", error);
    throw new Error("Failed to fetch Conversation with chatRoomId");
  }
}
