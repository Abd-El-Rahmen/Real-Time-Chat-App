import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";
import { Users, UserRoundPlus, Triangle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import avatar from "../assets/avatar.svg";
import { useFriendshipStore } from "../store/friendshipStore";

const Sidebar = () => {
  const { selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const {
    friends,
    getFriends,
    onlineFriends,
  } = useFriendshipStore();

  const { authUser } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getFriends(authUser._id);
  }, [getFriends]);

  const filteredFriends = showOnlineOnly
    ? friends.filter((friend) => onlineFriends.includes(friend._id))
    : friends;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1">
            <Triangle size={15} className="rotate-180" /> 
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>Contacts</a>
              </li>
              <li>
                <a>Groups</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineFriends.length} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredFriends.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center 
              hover:bg-base-300 transition-colors justify-between
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="flex gap-3">
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || avatar}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineFriends.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineFriends.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          </button>
        ))}

        {friends.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
