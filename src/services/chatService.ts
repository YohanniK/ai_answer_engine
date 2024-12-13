import { generateEmbeddings, queryEmbeddings } from "@/lib/vectorStore";
import client from "../lib/llmClient";
import { system_prompt } from "@/lib/prompts";
import Conversation from "@/models/Conversation";
import connectDB from "@/lib/database";

export async function handleChat(query: string) {
  await connectDB();

  const queryEmbedding = await generateEmbeddings(query);

  if (!queryEmbedding) {
    throw new Error("Error creating embedding from query");
  }

  const relevantData = await queryEmbeddings(
    process.env.PINECONE_INDEX_NAME || "YOUR_PINCONE_INDEX_NAME",
    queryEmbedding
  );

  const context = relevantData.matches
    .map(match => match.metadata?.content)
    .join("\n");

  const augmented_query =
    `<CONTEXT>\n" + "\n\n-------\n\n" ${context} + "\n-------\n</CONTEXT>\n\n\n\nMY QUESTION:\n` +
    query;

  return await client.chat.completions.create({
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: augmented_query },
    ],
    model: "llama-3.3-70b-versatile",
    stream: true,
  });
}

export async function saveConversation(
  chatRoomId: string,
  sender: string,
  message: string
) {
  await connectDB();
  const conversation = new Conversation({ chatRoomId, sender, message });
  return conversation.save();
}

export async function getConversation(chatRoomId: string) {
  await connectDB();
  return Conversation.find({ chatRoomId }).sort({ timestamp: 1 });
}

export async function deleteConversation(conversationId: string) {
  await connectDB();
  return Conversation.findByIdAndDelete(conversationId);
}
