import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD7um7l3X0h0l-zwMs7_o9Br-pQcqjRw08");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;
