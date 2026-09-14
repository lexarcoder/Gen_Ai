//  In this file we can write a AI chatbot code hear 


import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import readline from "readline";





const model = new ChatGoogleGenerativeAI({
    model: process.env.MODEL,
    apiKey: process.env.GEN_AI_API_KEY
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Enter your name: ", (name) => {
    console.log(`Hello ${name}!`);

    rl.close();
});