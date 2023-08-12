import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const chatContext = createContext();

// eslint-disable-next-line react/prop-types
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  return (
    <chatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(chatContext);
};
export default ChatProvider;
