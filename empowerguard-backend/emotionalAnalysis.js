// // // emotionalAnalysis.js
// // import { PromptTemplate } from '@langchain/core/prompts';
// // import { ChatOpenAI } from '@langchain/openai';
// // import { LLMChain } from '@langchain/core';

// // console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);


// // const promptTemplate = `
// // You are an expert mental health counselor.
// // Analyze the following journal entry text and determine the emotional tone.
// // Based on the text, respond with a JSON object in the following format:
// // {
// //   "tone": "<tone>",
// //   "recommendations": ["<recommendation 1>", "<recommendation 2>", ...]
// // }
// // Journal Entry:
// // {text}
// // `;

// // const prompt = new PromptTemplate({
// //   template: promptTemplate,
// //   inputVariables: ["text"],
// // });

// // const llm = new ChatOpenAI({
// //   openAIApiKey: process.env.OPENAI_API_KEY,
// //   temperature: 0.7,
// // });

// // const chain = new LLMChain({
// //   llm,
// //   prompt,
// // });

// // async function analyzeEmotionalTone(text) {
// //   try {
// //     const result = await chain.call({ text });
// //     return JSON.parse(result.text);
// //   } catch (error) {
// //     console.error("Error analyzing emotional tone:", error);
// //     return { tone: "unknown", recommendations: [] };
// //   }
// // }

// // export { analyzeEmotionalTone };




// // test.js
// import { ChatOpenAI } from '@langchain/openai';
// // import { LLMChain } from '@langchain/core/chains';
// import { PromptTemplate } from '@langchain/core/prompts';
// import dotenv from 'dotenv';
// dotenv.config();


// console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

// const promptTemplate = "Say hello. {text}";
// const prompt = new PromptTemplate({
//   template: promptTemplate,
//   inputVariables: ["text"],
// });

// const llm = new ChatOpenAI({
//   openAIApiKey: process.env.OPENAI_API_KEY,
//   temperature: 0.7,
// });

// const chain = new LLMChain({
//   llm,
//   prompt,
// });

// (async () => {
//   try {
//     // First, test the LLM directly
//     const directResponse = await llm.call("Say hello to world.");
//     console.log("LLM direct response:", directResponse);

//     // Now, test the chain
//     const result = await chain.call({ text: "world" });
//     console.log("Chain response:", result);
//   } catch (error) {
//     console.error("Error in test:", error);
//   }
// })();

// emotionalAnalysis.js
import dotenv from 'dotenv';
dotenv.config();

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableLambda } from '@langchain/core/runnables';

const promptTemplate = `
You are an expert mental health counselor.
Analyze the following journal entry text and determine the emotional tone.
Return only a JSON object with exactly the keys "tone" and "recommendations".
The JSON object must follow this structure without any additional text:
{{
  "tone": string,
  "recommendations": string[]
}}
Journal Entry:
{text}
`;

const prompt = new PromptTemplate({
  template: promptTemplate,
  inputVariables: ["text"],
});

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});

// Create a pipeline: prompt → model → JSON extraction via RunnableLambda
const pipe = prompt.pipe(llm).pipe(new RunnableLambda({ func: (input) => {
  // 'input' is expected to be the output from the model.
  // If it's an object with a 'text' property, use that.
  const output = (typeof input === 'object' && input.text) ? input.text : input.toString();
  try {
    return JSON.parse(output);
  } catch (error) {
    throw new Error("Failed to parse JSON: " + error.message + " | Output: " + output);
  }
}}));

async function analyzeEmotionalTone(text) {
  try {
    // Invoke the pipeline with the input text.
    const result = await pipe.invoke({ text });
    console.log("Parsed JSON result:", result);
    return result;
  } catch (error) {
    console.error("Error analyzing emotional tone:", error);
    return { tone: "unknown", recommendations: [] };
  }
}

export { analyzeEmotionalTone };