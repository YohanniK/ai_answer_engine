import type { NextConfig } from "next";
import "dotenv/config";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
};

export default nextConfig;
