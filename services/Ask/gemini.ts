import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  GoogleAIFileManager,
} from "@google/generative-ai";

const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const genAI = new GoogleGenerativeAI("AIzaSyCpz7_RkYVaJ-0tVyWgUpb2lP4dHVVhydM");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings: safetySetting,
});

export const model2 = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" },
  safetySettings: safetySetting,
});

export const model3 = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings: safetySetting,
  systemInstruction:
    "You are a english language instructor.Your name is Gem.Start the conversation with a greeting and introduce your name and self. your mission is to help with learning english, such as vocabulary, grammer etc.Act as a english teacher.Do not accept any other language besides english.Only respond to questions that help in learning english and nothing else",
});

export default model;
