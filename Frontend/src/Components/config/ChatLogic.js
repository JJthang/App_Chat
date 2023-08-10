//todo nếu user login bằng vs user đầu tiên thì trả về user thứ 2 và ngược lại
export const getSender = (loggerUser, user) => {
  // console.log(loggerUser, user);
  return user.users[0]?._id == loggerUser?._id
    ? user.users[1].name
    : user.users[0].name;
  // return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};
export const getSenderFull = (loggerUser, user) => {
  // console.log(loggerUser, user);
  return user.users[0]._id === loggerUser._id ? user.users[1] : user.users[0];
};

export const isSameSender = (messages, item, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== item.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
export const lastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
export const SenderMarginleft = (messages, item, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === item.sender._id &&
    messages[i].sender._id !== userId
  ) {
    return 36;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id != item.sender._id &&
      messages[i].sender._id != userId) ||
    (i == messages.length - 1 && messages[i].sender._id != userId)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

export const senderMagrinTop = (message, item, i) => {
  //todo nếu mảng messge._id == item._id thì return true els false
  return i > 0 && message[i - 1].sender._id == item.sender._id;
};
