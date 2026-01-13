import { GoogleGenAI } from "@google/genai";
import config from "../config/config";


export const geminiAiClient = new GoogleGenAI({
  apiKey: config.apikey,
});
