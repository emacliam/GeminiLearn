import { create } from "zustand";

const useChatStore = create((set) => ({
  history: {},
  newChat: false,
  openRecentActivity: (hist) =>
    set(() => {
      return { history: hist };
    }),
  openNewChat: () =>
    set((state) => ({ newChat: state.newChat ? false : true })),
}));

export default useChatStore;
