import { Groq } from "groq-sdk";

export const createGroqClient = () => {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
};