import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useGroupChatStore = create((set, get) => ({
  groups: [],
  groupMessages: [],
  groupMessagesLoading: false,
  socket: null,
  currentGroup: null,
  groupLoading: false,
  groupInfo: null,

  getGroupInfo: async (groupId) => {
    set({ groupLoading: true });
    try {
      const res = await axiosInstance.get(`/group/${groupId}`);

      set({ groupInfo: res.data ? res.data : null });
    } catch (error) {
      console.log(error);
    } finally {
      set({ groupLoading: false });
    }
  },

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

  leaveGroup: async (groupId) => {
    try {
      await axiosInstance.put(`/group/leaveGroup/${groupId}`);
      set({
        groups: get().groups.filter((group) => group._id !== groupId),
        currentGroup: null,
        groupInfo: null,
      });
      toast.success("You left the group");
    } catch (error) {
      console.error(error);
      toast.error("Error adding member");
    }
  },

  deleteGroup: async (groupId) => {
    try {
      await axiosInstance.delete(`/group/delete/${groupId}`);
      set({
        groups: get().groups.filter((group) => group._id !== groupId),
        currentGroup: null,
        groupInfo: null,
      });
      toast.success("group deleted");
    } catch (error) {
      console.log(error);
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
