import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useFriendshipStore = create((set, get) => ({
  friends: [],
  friendRequests: [],
  sentRequests: [],
  onlineFriends: [],
  userInfo: null,
  isLoading: false,

  setOnlineFriends: (of) => {
    set({ onlineFriends: of });
  },

  getFriends: async (userId) => {
    set({ isLoading: true });
    try {
      useAuthStore.apply.connectSocket;
      const res = await axiosInstance.get(`/friendship/friends`);
      set({ friends: res.data });
    } catch (error) {
      console.log(error);
      toast.error("Error sending friend request.");
    } finally {
      set({ isLoading: false });
    }
  },

  getFriendRequests: async () => {
    set({ isLoading: true });
    const res = await axiosInstance.get(`/friendship/requests`);
    set({ friendRequests: res.data });
    set({ isLoading: false });
  },

  sendFriendRequest: async (receiverId) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post(`/friendship/send/${receiverId}`);
      toast.success("Friend request sent successfully.");
    } catch (error) {
      toast.error("You already sent a request.");
    } finally {
      set({ isLoading: false });
    }
  },

  getSentRequests: async () => {
    set({ isLoading: true });
    const res = await axiosInstance.get(`/friendship/sent-req`);
    set({ sentRequests: res.data });
    set({ isLoading: false });
  },

  acceptFriendRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.put(`/friendship/status`, {
        status: "accepted",
        friendshipId: requestId,
      });
      console.log("friends", get().friends);
      set({
        friends: [...get().friends, res.data.sender],
        friendRequests: get().friendRequests.filter(
          (request) => request.sender._id !== res.data.sender._id
        ),
      });
      toast.success("Friend request accepted!");
    } catch (error) {
      console.log(error);

      toast.error("Error accepting friend request.");
    } finally {
      set({ isLoading: false });
    }
  },

  unfriendUser: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.delete(`/friendship/unfriend/${userId}`);
      set({
        friends: get().friends.filter((friend) => friend._id !== userId),
        friendRequests: get().friendRequests.filter(
          (request) => request.sender._id !== userId
        ),
      });
      // console.log(useChatStore.getState.selectedUser._id === userId);
      
      // if (useChatStore.getState.selectedUser._id === userId) {
      //   useChatStore.setState({ selectedUser: null });
      // }
      toast.success("Unfriended successfully.");
    } catch (error) {
      toast.error("Error unfriending user.");
    } finally {
      set({ isLoading: false });
    }
  },

  subscribeToFriendshipUpdates: () => {
    const socket = useAuthStore.getState().socket;
    const requests = get().friendRequests;
    socket.on("friendRequestReceived", (data) => {
      toast.success(`Someone sent you a friend request.`);
      set((state) => ({
        friendRequests: !requests.includes(data.request)
          ? [...state.friendRequests, data.request]
          : requests,
      }));
    });

    socket.on("friendRequestAccepted", (data) => {
      toast.success(`Accepted Successfully `);
      set((state) => ({
        friends: [...state.friends, data.sender],
      }));
    });

    socket.on("unfriendUser", (data) => {
      set((state) => ({
        friends: state.friends.filter((friend) => friend._id !== data.senderId),
      }));
    });
  },

  unsubscribeFromFriendshipUpdates: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("friendRequestReceived");
    socket.off("friendRequestAccepted");
    socket.off("friendRequestRejected");
    socket.off("unfriendUser");
  },
}));
