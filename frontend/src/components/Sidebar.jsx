import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";
import { Users, UserRoundPlus, Triangle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import avatar from "../assets/avatar.svg";
import { useFriendshipStore } from "../store/friendshipStore";
import Contacts from "./Contacts";
import Groups from "./Groups";
import { useGroupChatStore } from "../store/groupStore";

const Sidebar = () => {
  const { selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { groups, getGroups, setGroup, currentGroup } = useGroupChatStore();

  const { friends, getFriends, onlineFriends } = useFriendshipStore();

  const { authUser } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const [content, setContent] = useState(
    localStorage.getItem("content") || "Contact"
  );

  const handleChangeContent = (item) => {
    setSelectedUser(null);
    setGroup(null);
    setContent(item);
    localStorage.setItem("content", item);
  };

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">{content}</span>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1">
              <Triangle size={15} className="rotate-180" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52  shadow"
            >
              <li
                className={`${content === "Contact" ? "underline" : ""}`}
                onClick={() => handleChangeContent("Contact")}
              >
                <a>Contacts</a>
              </li>
              <li
                className={`${content === "Group" ? "underline" : ""}`}
                onClick={() => handleChangeContent("Group")}
              >
                <a>Groups</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {content === "Contact" ? <Contacts /> : <Groups />}
      </div>
    </aside>
  );
};

export default Sidebar;
