import { Loader2, Users } from "lucide-react";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useFriendshipStore } from "../store/friendshipStore";
import { useAuthStore } from "../store/useAuthStore";
import avatar from "../assets/avatar.svg";
import { useGroupChatStore } from "../store/groupStore";

const initialFormData = {
  name: "",
  members: [],
};

const CreateGroupPage = () => {
  const { friends, getFriends, isLoading } = useFriendshipStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const { createGroup, groupLoading } = useGroupChatStore();
  const [formData, setFormData] = useState(initialFormData);

  const validDataForm = () => {
    if (formData.name.length === 0) {
      toast.error("Group name is required");
      return false;
    }
    if (formData.members.length === 0) {
      toast.error("At least one member is required");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (authUser) {
      getFriends(authUser._id);
    }
  }, [authUser, getFriends]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validDataForm()) return;
    createGroup(formData.name, formData.members);
    setFormData(initialFormData);
    navigate('/')
  };

  const handleMemberSelect = (friendId) => {
    setFormData((prevFormData) => {
      const updatedMembers = prevFormData.members.includes(friendId)
        ? prevFormData.members.filter((id) => id !== friendId)
        : [...prevFormData.members, friendId];
      return { ...prevFormData, members: updatedMembers };
    });
  };

  return (
    <div className="min-h-screen pt-20">
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl  font-semibold">Create Group</h1>
        <p className="text-sm text-gray-500 mt-2">
          Create a new group and add your friends.
        </p>
      </div>
  
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label font-medium text-gray-700">Group Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Users className="text-gray-400" />
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-10"
              placeholder="Enter Group Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
        </div>
  
        <div className="form-control">
          <label className="label font-medium text-gray-700">Add Members</label>
          <div className="w-full overflow-y-auto max-h-60">
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              friends?.map((friend) => (
                <div
                  key={friend._id}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="flex gap-2 items-center">
                    <img
                      src={friend.profilePic || avatar}
                      alt={friend.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{friend.fullName}</span>
                  </div>
                  <input
                    type="checkbox"
                    className="cursor-pointer checkbox checkbox-primary"
                    checked={formData.members.includes(friend._id)}
                    onChange={() => handleMemberSelect(friend._id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
  
        <button
          type="submit"
          className="btn btn-primary w-full py-3 text-white font-semibold hover:bg-blue-700"
          disabled={groupLoading}
        >
          {groupLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Creating Group...
            </>
          ) : (
            "Create Group"
          )}
        </button>
      </form>
    </div>
  </div>
  
  );
};

export default CreateGroupPage;
