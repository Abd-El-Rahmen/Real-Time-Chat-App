import React, { useEffect } from "react";
import { CirclePlus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useGroupChatStore } from "../store/groupStore";

const Groups = () => {
  const { groups, getGroups, setGroup, currentGroup } = useGroupChatStore();
  useEffect(() => {
    getGroups();
  }, [getGroups]);

  return (
    <div className="px-2 space-y-2">
      {groups.map((group) => (
        <button
          key={group._id}
          onClick={() => setGroup(group)}
          className={`
                          w-full p-3 flex items-center 
                          hover:bg-base-300 transition-colors justify-between
                          ${
                            currentGroup?._id === group._id
                              ? "bg-base-300 ring-1 ring-base-300"
                              : ""
                          }
                        `}
        >
          <div className="flex gap-4 items-center">
            <div className="relative mx-auto lg:mx-0">
              <Users
                key={group.name}
                className="size-10 object-cover rounded-full"
              />
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{group.name}</div>
            </div>
          </div>
        </button>
      ))}

      <Link
        to={"/create-group"}
        className="btn bg-primary/10 text-primary w-full"
      >
        <CirclePlus /> Create Group
      </Link>
    </div>
  );
};

export default Groups;
