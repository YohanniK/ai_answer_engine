import ScrapedData from "../models/ScrapedData";
import { scrapeUrl } from "../lib/puppeteer";
import { generateEmbeddings, storeEmbeddings } from "@/lib/vectorStore";
import connectDB from "@/lib/database";

export async function scrapeAndStore(chatRoomId: string, urls: string[]) {
  await connectDB();

  const scrapedResults = [];
  for (const url of urls) {
    const data = await scrapeUrl(url);
    console.log("scrapedData", data);
    const scrapedData = new ScrapedData({ ...data, chatRoomId });
    await scrapedData.save();

    const contentToEmbed = scrapedData.toJSON();
    const embedding = await generateEmbeddings(JSON.stringify(contentToEmbed));
    if (embedding) {
      await storeEmbeddings(
        process.env.PINECONE_INDEX_NAME || "YOUR_PINECONE_INDEX_NAME",
        scrapedData._id.toString(),
        embedding,
        {
          chatRoomId,
          url,
        }
      );
    }
    scrapedResults.push(scrapedData);
  }

  return scrapedResults;
}

export async function getScrapedData(chatRoomId: string) {
  await connectDB();
  return ScrapedData.find({ chatRoomId });
}
