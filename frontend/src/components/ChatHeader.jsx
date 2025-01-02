import { Users, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import avatar from "../assets/avatar.svg";
import { useFriendshipStore } from "../store/friendshipStore";
import { Link } from "react-router-dom";
import { useGroupChatStore } from "../store/groupStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineFriends } = useFriendshipStore();

  const {  setGroup, currentGroup } = useGroupChatStore();
  if (selectedUser !== null)
    return (
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img
                  src={selectedUser.profilePic || avatar}
                  alt={selectedUser.fullName}
                />
              </div>
            </div>

            <div>
              <Link
                to={`/profile?user=${encodeURIComponent(selectedUser._id)}`}
                className="font-medium hover:underline"
              >
                {selectedUser.fullName}
              </Link>
              <p className="text-sm text-base-content/70">
                {onlineFriends.includes(selectedUser._id)
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
          </div>

          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    );
  if (currentGroup !== null)
    return (
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <Users
                  key={currentGroup._id}
                  className="size-10 object-cover rounded-full"
                />
              </div>
            </div>

            <div className="font-medium hover:underline">
              {currentGroup.name}
            </div>
          </div>

          <button onClick={() => setGroup(null)}>
            <X />
          </button>
        </div>
      </div>
    );
};
export default ChatHeader;
