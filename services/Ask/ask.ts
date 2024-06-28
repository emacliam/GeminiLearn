import axios from "axios";
import model from "./gemini";

class Ask {
  async request(data: any) {
    const prompt = data.text;

    const result = await model.generateContent([prompt]);
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
}

export default new Ask();
