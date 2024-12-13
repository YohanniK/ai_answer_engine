// TODO: Implement the chat API with Groq and web scraping with Cheerio and Puppeteer
// Refer to the Next.js Docs on how to read the Request body: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// Refer to the Groq SDK here on how to use an LLM: https://www.npmjs.com/package/groq-sdk
// Refer to the Cheerio docs here on how to parse HTML: https://cheerio.js.org/docs/basics/loading
// Refer to Puppeteer docs here: https://pptr.dev/guides/what-is-puppeteer

import { NextResponse } from "next/server";
import { extractUrls } from "@/utils/extractUrls";
import { scrapeAndStore } from "@/services/scrapeAndStore";
import {
  getConversation,
  handleChat,
  saveConversation,
} from "@/services/chatService";

export async function POST(req: Request) {
  try {
    // parse req.body
    const { chatRoomId, sender, message } = await req.json();
    if (!chatRoomId || !sender || !message) {
      return NextResponse.json(
        { error: "chatRoomId, sender, and message are required fields." },
        { status: 400 }
      );
    }

    // Scrape and Store data to MongoDB and VectorDB
    const urls = extractUrls(message);
    console.log(urls);
    if (urls.length > 0) await scrapeAndStore(chatRoomId, urls);

    // Save User Message
    await saveConversation(chatRoomId, sender, message);

    // Chat with LLM
    const chatCompletion = await handleChat(message);

    let aiResponse = "";
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatCompletion) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              aiResponse += text;
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          // Save AI response
          await saveConversation(chatRoomId, "ai", aiResponse);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An internal server error occured" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";

// import Groq from "groq-sdk";
// import * as cheerio from "cheerio";
// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium-min";
// import getUrls from "get-urls";
// import fetch from "node-fetch";

// // LLM client
// const client = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// // Web Scrapping options
// chromium.setHeadlessMode = true;
// chromium.setGraphicsMode = false;

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     if (!body.message) {
//       return NextResponse.json(
//         { error: "Message content was required" },
//         { status: 400 }
//       );
//     }

//     // Web scrapping
//     // Filter the urls listed in the req
//     const urls = Array.from(getUrls(body.message));
//     var results: Promise<
//       (() => Promise<
//         | {
//             url: string;
//             pageTitle: string;
//             description: string;
//             error?: undefined;
//           }
//         | {
//             url: string;
//             error: any;
//             pageTitle?: undefined;
//             description?: undefined;
//           }
//       >)[]
//     >;

//     // If we don't have URLs no need trying to scrape data
//     if (urls.length > 0) {
//       // Fetching APIs
//       const browser = await puppeteer.launch({
//         args: chromium.args,
//         defaultViewport: chromium.defaultViewport,
//         executablePath: await chromium.executablePath(),
//         headless: chromium.headless,
//       });

//       results = Promise.all(
//         urls.map(url => async () => {
//           try {
//             const page = await browser.newPage();
//             await page.goto(url);
//             const pageTitle = await page.title();
//             const html = await page.content();
//             const $ = cheerio.load(html);

//             const description =
//               $('meta[name="description"]').attr("content") ||
//               "No description available";

//             await page.close();

//             return {
//               url,
//               pageTitle,
//               description,
//             };
//           } catch (error) {
//             console.log(`Error scraping ${url}:`, error);
//             return { url, error: error };
//           }
//         })
//       );
//       await browser.close();
//     }

//     // Chat with LLM
//     const chatCompletion = await client.chat.completions.create({
//       messages: [{ role: "user", content: body.message }],
//       model: "llama-3.3-70b-versatile",
//       stream: true,
//     });

//     const stream = new ReadableStream({
//       async start(controller) {
//         try {
//           for await (const chunk of chatCompletion) {
//             const text = chunk.choices[0]?.delta?.content || "";
//             if (text) controller.enqueue(new TextEncoder().encode(text));
//           }
//         } catch (error) {
//           controller.error(error);
//         } finally {
//           controller.close();
//         }
//       },
//     });

//     return new Response(stream, {
//       headers: { "Content-Type": "text/plain" },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "An internal server error occured" },
//       { status: 500 }
//     );
//   }
// }
