import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Loader2, User } from "lucide-react";
import avatar from "../assets/avatar.svg";
import { useFriendshipStore } from "../store/friendshipStore";
import { Navigate, useLocation } from "react-router-dom";

const ProfilePage = () => {
  const {
    authUser,
    isUpdatingProfile,
    updateProfilePicture,
    userInfo,
    getUserInfoLoading,
    getUserInfo,
  } = useAuthStore();
  const [requestSent, setRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pending, setPending] = useState(null);
  const [unfriendButton, setUnfriendButton] = useState("");
  const {
    sendFriendRequest,
    getFriendRequests,
    friends,
    friendRequests,
    acceptFriendRequest,
    getSentRequests,
    sentRequests,
    getFriends,
    unfriendUser,
    isLoading,
  } = useFriendshipStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfilePicture({ profilePic: base64Image });
    };
  };
  const location = useLocation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newId = queryParams.get("user");
    setUserId(newId);

    const fetchUserData = async () => {
      await getUserInfo(newId);
      await getSentRequests();
      await getFriendRequests();
      await getFriends(authUser._id);
    };

    fetchUserData();
  }, [location.search, authUser._id,userId]);

  useEffect(() => {
    if (!userInfo) return;

    const req = friendRequests.find((req) => req.sender._id === userInfo?._id);

    setPending(req || null);
    setRequestSent(
      sentRequests.some((req) => req.receiver._id === userInfo?._id)
    );
    setIsFriend(friends.some((friend) => friend._id === userId));
    setUnfriendButton(isFriend ? "Unfriend" : pending ? "Refuse" : "");
  }, [userInfo, friendRequests, sentRequests, friends, userId]);

  if (getUserInfoLoading || isLoading) {
    return (
      <div className="bg-base-300 min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-5 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || userInfo?.profilePic || avatar}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                } ${authUser._id !== userId ? "hidden" : ""}`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400 ">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {userInfo?.fullName}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Email
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {userInfo?.email}
              </p>
            </div>
            {isFriend ? (
              ""
            ) : pending !== null ? (
              <button
                onClick={() => {
                  acceptFriendRequest(pending._id);
                  setPending(null);
                }}
                className="btn bg-success w-full"
              >
                Accept
              </button>
            ) : (
              <button
                disabled={requestSent}
                onClick={() => {
                  sendFriendRequest(userInfo?._id);
                }}
                className={`btn  w-full bg-secondary`}
              >
                {requestSent ? "Request Sent " : "Send Request"}
              </button>
            )}
            <button
              onClick={() => {
                unfriendUser(userId);
                setPending(null);
              }}
              className={`btn bg-error w-full ${
                unfriendButton.length === 0 && "hidden"
              }`}
            >
              {unfriendButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
