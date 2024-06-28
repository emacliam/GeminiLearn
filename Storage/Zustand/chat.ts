import { create } from "zustand";

const useChatStore = create((set) => ({
  history: [],
  openRecentActivity: (hist) => set(() => ({ history: hist })),
}));

export default useChatStore;
