import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useChatStore = create(
  persist(
    (set, get) => ({
      chats: [],
      newChat: false,
      historyClicked: false,
      clickedID: "",
      addMessage: (id: any, messages: any) =>
        set((state: any) => {
          const updatesChats = state.chats.map((chat: any) => {
            if (chat.id == id) {
              chat.history = [...chat.history, ...messages];
              return chat;
            } else {
              return chat;
            }
          });

          return { chats: updatesChats };
        }),
      createNewChat: (id: any, messages: any, title: any) =>
        set((state: any) => {
          try {
            const chat = {
              id: id,
              title: title,
              history: [...messages],
            };

            return { chats: [...state.chats, chat] };
          } catch (error) {
            console.log("error creating new chat", error);
          }
        }),

      openNewChat: () =>
        set((state: any) => ({ newChat: state.newChat ? false : true })),
      openHistoryChat: (id: any) =>
        set((state: any) => {
          return {
            historyClicked: state.historyClicked ? false : true,
            clickedID: id,
          };
        }),
      clearChat: () =>
        set(() => {
          return { chats: [] };
        }),
    }),
    {
      name: "chat-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useChatStore;
