import axios from "axios";
import model, { model2 } from "./gemini";
import { ResponseSchema } from "@google/generative-ai";

class Ask {
  async request(data: any) {
    const prompt = data.text;
    const result = await model.generateContent([prompt]);
    return result;
  }

  async requestJson(data: any) {
    const prompt = data.text;
    const result = await model2.generateContent([prompt]);
    return result;
  }

  async multiconvo(history: any, msg) {
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(msg);
    return result.response.text();
  }

  async requestChat(data: any) {
    const prompt = data.text;
    model.systemInstruction = {
      role: "user",
      parts: [
        {
          text: "You are here to assit me with learning english",
        },
      ],
    };

    const result = await model.generateContent([prompt]);
    return result;
  }

  async multiconvoChat(history: any, msg) {
    model.systemInstruction = {
      role: "user",
      parts: [
        {
          text: "You are here to assit me with learning english",
        },
      ],
    };
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(msg);
    return result.response.text();
  }

  async multimedia(data: any) {
    const prompt = data.text;
    const image = {
      inlineData: {
        data: data.img,
        mimeType: data.mime,
      },
    };

    const result = await model.generateContent([prompt, image]);
    return result;
  }

  async multimediaAudio(data: any) {
    const prompt = { text: data.text };
    const audio = {
      inlineData: {
        data: data.uri,
        mimeType: "audio/wav",
      },
    };

    const result = await model.generateContent([prompt, audio]);
    return result;
  }
}

export default new Ask();
