import React, { useEffect, useState } from "react";
import { useSearchStore } from "../store/useSearchStore";
import { Link, useLocation } from "react-router-dom";
import { useFriendshipStore } from "../store/friendshipStore";
import avatar from "../assets/avatar.svg";
import { Loader2, UserRoundCheck, UserRoundPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const SearchPage = () => {
  const { results, searchLoading, searchForUsers } = useSearchStore();
  const location = useLocation();
  const [disableSendBtn, setDisableSendBtn] = useState([]);
  const {
    sendFriendRequest,
    friends,
    friendRequests,
    acceptFriendRequest,
    getSentRequests,
    sentRequests,
    getFriends,
  } = useFriendshipStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    searchForUsers(queryParams.get("query"));
    getSentRequests();
    getFriends(authUser._id);
    setDisableSendBtn(sentRequests.map(req => req.receiver._id));
  }, [location.search, authUser]);

  if (searchLoading)
    return (
      <div className="bg-base-300 min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-5 animate-spin " />
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Results</h1>
          </div>
          {results.map((user) =>
            !friends.map((friend) => friend._id).includes(user._id) ? (
              <div
                key={user._id}
                className={`w-full py-3 sm:px-10 md:px-20 px-5 flex items-center hover:bg-base-300 transition-colors justify-between`}
              >
                <div className="flex gap-3">
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.profilePic || avatar}
                      alt={user.name}
                      className="size-12 object-cover rounded-full"
                    />
                  </div>
                </div>
                <Link
                  to={`/profile?user=${encodeURIComponent(user._id)}`}
                  className="text-left min-w-0 hover:underline"
                >
                  <div className="font-medium truncate">{user.fullName}</div>
                </Link>
                {friendRequests
                  .map((req) => req.sender._id)
                  .includes(user._id) ? (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => {
                      acceptFriendRequest(
                        friendRequests
                          .filter((req) => req.sender._id === user._id)
                          .map((req) => req._id)
                      );
                    }}
                  >
                    Accept
                  </button>
                ) : (
                  <button
                    disabled={disableSendBtn.includes(user._id)}
                    onClick={() => {
                      sendFriendRequest(user._id);
                      setDisableSendBtn((prev) => [...prev, user._id]);
                    }}
                    className="btn hover:opacity-70"
                  >
                    <UserRoundPlus />
                  </button>
                )}
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
