import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Add this line to load variables from .env

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

export default ai;