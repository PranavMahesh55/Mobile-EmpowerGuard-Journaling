import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableLambda } from '@langchain/core/runnables';

const promptTemplate = `
You are an expert mental health counselor.
Analyze the following journal entry text and determine the emotional tone.
Always provide at least one recommendation in the "recommendations" array, even if the tone is positive.
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