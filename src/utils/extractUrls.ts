import getUrls from "get-urls";

export function extractUrls(text: string) {
  return Array.from(getUrls(text));
}
