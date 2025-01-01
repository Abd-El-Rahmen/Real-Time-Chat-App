import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User } from "lucide-react";
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
  const [unfriendButton,setUnfriendButton] = useState("")
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
    setUserId(queryParams.get("user"));
    getUserInfo(queryParams.get("user"));
    getSentRequests();
    getFriendRequests();
    getFriends(authUser._id);
    const req = friendRequests.map((req) => {
      if (req.sender._id === userInfo?._id) return req;
    })[0];

    setPending(req !== undefined ? req : null);

    setRequestSent(
      sentRequests.map((req) => req.receiver._id).includes(userInfo?._id)
    );
    setIsFriend(friends.map((friend) => friend._id).includes(userId));
    setUnfriendButton(isFriend ? "Unfriend" : pending !== null ? "Refuse" :   "")
  }, [
    userInfo,
    location.search,
    getSentRequests,
    getFriends,
    authUser,
    sendFriendRequest,
    acceptFriendRequest,
  ]);

  if (getUserInfoLoading) {
    return (
      <div className="bg-base-300 min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-5 animate-spin " />
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
              className={`btn bg-error w-full ${unfriendButton.length === 0 && "hidden"}`}
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
