import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore.js";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useGroupChatStore = create((set, get) => ({
  groups: [],
  groupMessages: [],
  groupMessagesLoading: false,
  socket: null,
  currentGroup: null,
  groupLoading: false,

  getGroups: async () => {
    set({ groupLoading: true });
    try {
      const res = await axiosInstance.get("/group/all");
      set({ groups: res.data });
    } catch (error) {
      toast.error("error in fetching groups");
    } finally {
      set({ groupLoading: false });
    }
  },

  createGroup: async (groupName, members) => {
    set({ groupLoading: true });
    try {
      const response = await axiosInstance.post("/group/createGroup", {
        name: groupName,
        members,
      });
      set((state) => ({
        groups: [...state.groups, response.data.group],
      }));
      toast.success("Group created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error creating group");
    } finally {
      set({ groupLoading: false });
    }
  },

  addMemberToGroup: async (groupId, userId) => {
    try {
      await axiosInstance.put(`/group/addMemberToGroup/${groupId}`, {
        userId,
      });
      toast.success("Member added to group");
    } catch (error) {
      console.error(error);
      toast.error("Error adding member");
    }
  },

  sendGroupMessage: async (messageData) => {
    const { currentGroup, groupMessages } = get();
    try {
      const res = await axiosInstance.post(
        `/group/sendGroupMessage`,
        messageData
      );

      set({ groupMessages: [...groupMessages, res.data] });
    } catch (error) {
      console.log(error);
    }
  },
  getGroupMessages: async (groupId) => {
    try {
      const response = await axiosInstance.get(
        `/group/groupMessages/${groupId}`
      );

      set({ groupMessages: response.data });
    } catch (error) {
      console.error(error);
      toast.error("Error fetching group messages");
    }
  },

  subscribeToGroupMessages: () => {
    const { currentGroup } = get();
    if (!currentGroup) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newGroupMessage", (newMessage) => {
      const isMessageSentFromSelectedGroup =
        newMessage.groupId === currentGroup._id;
      if (!isMessageSentFromSelectedGroup) return;
      set({
        groupMessages: [...get().groupMessages, newMessage],
      });
    });
  },

  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newGroupMessage");
  },

  setGroup: (group) => {
    set({ currentGroup: group });
  },
}));
