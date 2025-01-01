import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, Hand, User, Bell, Menu, Check, X } from "lucide-react";
import ThemeButton from "./ThemeButton";
import { useFriendshipStore } from "../store/friendshipStore";
import avatar from "../assets/avatar.svg";
import SearchInput from "./SearchInput";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const {
    sendFriendRequest,
    friendRequests,
    subscribeToFriendshipUpdates,
    unsubscribeFromFriendshipUpdates,
    getFriendRequests,
    acceptFriendRequest,
    unfriendUser,
  } = useFriendshipStore();

  useEffect(() => {
    if (authUser !== null) {
      subscribeToFriendshipUpdates();
      getFriendRequests();
      return () => unsubscribeFromFriendshipUpdates();
    }
  }, [
    authUser,
    acceptFriendRequest,
    sendFriendRequest,
    getFriendRequests,
    subscribeToFriendshipUpdates,
    unsubscribeFromFriendshipUpdates,
  ]);

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 py-2">
      <div className="container mx-auto px-4 h16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to={"/"}
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Hand className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">SayHy</h1>
            </Link>
          </div>
          {authUser && <SearchInput />}
          <div className="flex items-center gap-4">
            <ThemeButton />
            {authUser && (
              <>
                <div className="dropdown dropdown-end">
                  <div className=" relative">
                    <Bell
                      tabIndex={0}
                      className="w-14 sm:w-20 cursor-pointer"
                    />
                    <span
                      className={`absolute bg-red-600 text-white  rounded-full right-2 bottom-0 px-1 ${
                        friendRequests.length <= 0 ? "hidden" : ""
                      }`}
                    >
                      {friendRequests.length}
                    </span>
                  </div>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
                  >
                    {friendRequests && friendRequests.length > 0 ? (
                      friendRequests?.map((item) => (
                        <li key={item._id}>
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                item.sender.profilePic
                                  ? item.sender.profilePic
                                  : avatar
                              }
                              alt={item.sender.fullName}
                              className="w-8 h-8 rounded-full"
                            />
                            <span>{item.sender.fullName}</span>
                            <div className="">
                              <button
                                className="w-20 hover:opacity-65"
                                onClick={() => {
                                  acceptFriendRequest(item._id);
                                }}
                              >
                                <Check className="text-success" />
                              </button>
                              <button
                                onClick={() => {
                                  unfriendUser(item.sender._id);
                                }}
                                className="w-20 hover:opacity-65"
                              >
                                <X className="text-error" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>
                        <span>No friend requests</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="drawer drawer-end">
                  <input
                    id="my-drawer-4"
                    type="checkbox"
                    className="drawer-toggle"
                  />
                  <div className="drawer-content">
                    <label
                      htmlFor="my-drawer-4"
                      className="text-base cursor-pointer"
                    >
                      <Menu />
                    </label>
                  </div>
                  <div className="drawer-side">
                    <label
                      htmlFor="my-drawer-4"
                      aria-label="close sidebar"
                      className="drawer-overlay"
                    ></label>
                    <ul className="flex flex-col items-center bg-base-200 gap-4 text-base-content min-h-full w-24 p-4">
                      <li>
                        <Link
                          to={`/profile?user=${encodeURIComponent(
                            authUser._id
                          )}`}
                          className="btn btn-sm "
                        >
                          <User className="size-8" />
                        </Link>
                      </li>
                      <li>
                        <button onClick={logout} className="">
                          <LogOut className="size-8" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
