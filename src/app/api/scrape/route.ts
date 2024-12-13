import { scrapeAndStore } from "@/services/scrapeAndStore";
import { extractUrls } from "@/utils/extractUrls";

export async function POST(req: Request) {
  const { chatRoomId, message } = await req.json();

  const urls = extractUrls(message);
  const results = await scrapeAndStore(chatRoomId, urls);

  return new Response(JSON.stringify(results), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
