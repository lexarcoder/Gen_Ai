
// import "dotenv/config"; 
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import readline from "readline/promises";



// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// const model = new ChatGoogleGenerativeAI({
//     model: process.env.MODEL,
//     apiKey: process.env.GEN_AI_API_KEY,
// });

// while(true){
//     const userInput = await rl.question("You: ")
//     const res = await model.invoke(userInput);
//     console.log("AI:", res.text);
// }
// rl.close();

import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import readline from "readline/promises";
import { messageToOpenAIRole } from "@langchain/openai";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const model = new ChatGoogleGenerativeAI({
    model: process.env.MODEL,
    apiKey: process.env.GEN_AI_API_KEY,
    temperature: 0.7,
});

console.log("🤖 AI Chatbot Started");
console.log("Type 'exit' to quit.\n");

try {


    const message = []

    while (true) {
        const userInput = await rl.question("You: ");

        if (!userInput.trim()) {
            continue;
        }

        if (userInput.toLowerCase() === "exit") {
            console.log("👋 Chatbot stopped.");
            break;
        }

        try {
            const response = await model.invoke(userInput);

messageToOpenAIRole

            console.log("AI:", response.content);
            console.log();
        } catch (error) {
            console.error("❌ AI Error:", error.message);
        }


    }
} finally {
    rl.close();
}