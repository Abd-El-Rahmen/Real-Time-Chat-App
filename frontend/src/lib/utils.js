export const formatMessageTime = (data) => {
  return new Date(data).toLocaleDateString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const filterUsers = (allOnlineUserIds, friends, userId) => {
  const friendIds = friends.map((friend) => friend._id);

  const onlineFriends = allOnlineUserIds.filter((userId) =>
    friendIds.includes(userId)
  );
  return onlineFriends;
};
