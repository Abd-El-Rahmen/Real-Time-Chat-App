import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import avatar from "../assets/avatar.svg";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useGroupChatStore } from "../store/groupStore";
import { Link, useNavigate } from "react-router-dom";

const ChatContainer = () => {
  const navigate = useNavigate();
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const {
    groupMessagesLoading,
    getGroupMessages,
    currentGroup,
    groupMessages,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useGroupChatStore();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
    if (currentGroup) {
      getGroupMessages(currentGroup._id);
      subscribeToGroupMessages();
      return () => unsubscribeFromGroupMessages();
    }
  }, [
    selectedUser?._id,
    currentGroup?._id,
    authUser,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    getGroupMessages,
    subscribeToGroupMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading || groupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (currentGroup !== null)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {groupMessages &&
            groupMessages.length > 0 &&
            groupMessages.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId._id === authUser._id
                    ? "chat-end"
                    : "chat-start"
                }`}
                ref={messageEndRef}
              >
                <div className=" chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <Link
                      to={`/profile?user=${encodeURIComponent(
                        message.senderId._id
                      )}`}
                    >
                      <img
                        src={
                          message.senderId.profilePic
                            ? message.senderId.profilePic
                            : avatar
                        }
                        className="cursor-pointer"
                        alt="profile pic"
                      />
                    </Link>
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
        </div>
        <MessageInput />
      </div>
    );
  if (selectedUser !== null)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages &&
            messages.length > 0 &&
            messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
                ref={messageEndRef}
              >
                <div className=" chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <Link
                      to={`/profile?user=${encodeURIComponent(
                        message.senderId
                      )}`}
                    >
                      <img
                        src={
                          message.senderId === authUser._id
                            ? authUser.profilePic
                              ? authUser.profilePic
                              : avatar
                            : selectedUser.profilePic
                            ? selectedUser.profilePic
                            : avatar
                        }
                        alt="profile pic"
                      />
                    </Link>
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
        </div>
        <MessageInput />
      </div>
    );
};
export default ChatContainer;
