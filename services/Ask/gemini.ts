import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCpz7_RkYVaJ-0tVyWgUpb2lP4dHVVhydM");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;
