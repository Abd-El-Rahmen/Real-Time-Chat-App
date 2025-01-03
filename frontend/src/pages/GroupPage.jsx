import React, { useEffect } from "react";
import { useGroupChatStore } from "../store/groupStore";
import { List, Loader2, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.svg";
import { useAuthStore } from "../store/useAuthStore";

const GroupPage = () => {
  const location = useLocation();
    const navigate = useNavigate();

  const { groupLoading, groupInfo, getGroupInfo, leaveGroup, deleteGroup } =
    useGroupChatStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newId = queryParams.get("group");
    getGroupInfo(newId);
  }, [location.search, getGroupInfo]);

  if (groupLoading) {
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
            <h1 className="text-2xl font-semibold ">Group Informations</h1>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Group Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {groupInfo?.name}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <List className="w-4 h-4" />
                Members
              </div>
              <div className="flex flex-col px-4 sm:px-10 py-2.5 space-y-2 bg-base-200 rounded-lg border">
                <Link
                  to={`/profile?user=${encodeURIComponent(
                    groupInfo?.admin._id
                  )}`}
                  className="cursor-pointer  flex items-center justify-between "
                >
                  <div className="flex items-center gap-4 hover:underline">
                    {" "}
                    <img
                      src={groupInfo?.admin.profilePic || avatar}
                      alt={groupInfo?.admin.name}
                      className="size-8 object-cover rounded-full"
                    />
                    {groupInfo?.admin.fullName}
                  </div>
                  <span className="font-bold text-gray-700">admin</span>
                </Link>
                {groupInfo?.members.map((member) => (
                  <Link
                    to={`/profile?user=${encodeURIComponent(member._id)}`}
                    className="cursor-pointer hover:underline flex items-center gap-4"
                  >
                    <img
                      src={member.profilePic || avatar}
                      alt={member.name}
                      className="size-8 object-cover rounded-full"
                    />
                    {member.fullName}
                  </Link>
                ))}
              </div>
            </div>
            {groupInfo?.members
              .map((member) => member._id)
              .includes(authUser._id) && (
              <button
                onClick={() => {
                  leaveGroup(groupInfo._id);
                  navigate('/')
                }}
                className={`btn bg-error w-full `}
              >
                Leave Group
              </button>
            )}
            {groupInfo?.admin._id === authUser._id && (
              <button
                onClick={() => {
                  deleteGroup(groupInfo._id);
                  navigate('/')
                }}
                className={`btn bg-error w-full `}
              >
                Delete Group
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
