import { useEffect, useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import { Box, FormControl, Input, Text, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "../ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import "../style.css";
import ScrollAble from "./ScrollAble";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";

var socket, selectedChatCompare;
// eslint-disable-next-line react/prop-types, no-unused-vars
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [socketConnect, setSocketConnect] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const toat = useToast();
  const ENDPOINT = "http://localhost:3000";
  const typeingHandler = (e) => {
    setNewMessage(e.target.value);
    console.log(!typing);
    if (!socketConnect) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTime = new Date().getTime();
    console.log(lastTime);
    let timeLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      console.log(timeNow);
      const getTime = timeNow - lastTime;
      console.log(getTime);
      if (getTime >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };
  const ClearLoad = () => {
    if (!socketConnect) return;
    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnect(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/getMessage/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(data.data);
      setMessages([...messages, ...data.data]);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toat({
        title: "Error Occured",
        description: "Failed to load message",
        duration: 5000,
        status: "error",
        isClosable: true,
        position: "top-right",
      });
    }
  };
  useEffect(() => {
    socket.on("message received", (messageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id != messageRecieved.chat._id
      ) {
        console.log([messageRecieved, ...notification]);
        console.log([...notification]);
        console.log([messageRecieved]);
        if (!notification.includes(messageRecieved)) {
          setNotification([messageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        console.log(messageRecieved);
        setMessages([...messages, messageRecieved]);
      }
    });
  });

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notification, "---------------");

  const handSendMessage = async (value) => {
    try {
      if (value.key == "Enter" && newMessage) {
        socket.emit("stop typing", selectedChat._id);
        const { data } = await axios.post(
          `http://localhost:3000/api/send`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        socket.emit("new message", data.data);
        setNewMessage("");
        setMessages([...messages, data.data]);
      }
    } catch (error) {
      toat({
        title: "Error Occured",
        description: "Can't send message ",
        duration: 5000,
        status: "error",
        isClosable: true,
        position: "top-right",
      });
    }
  };
  // console.log(newMessage);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={"space-between"}
            alignItems="center"
          >
            {!selectedChat.isGroupChat ? (
              <>
                {/* {selectedChat.chatName.toUpperCase()} */}
                {getSender(user, selectedChat)}
                <ProfileModal user={getSenderFull(user, selectedChat)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            bg="#E8E8E8"
            w={"98%"}
            h={"86.8%"}
            margin={3}
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            borderRadius={"lg"}
            overflow={"hidden"}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="chartBar">
                <ScrollAble messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={handSendMessage}>
              {istyping ? (
                <Lottie
                  options={defaultOptions}
                  width={70}
                  height={30}
                  style={{ margin: "10px 0px" }}
                />
              ) : (
                <></>
              )}
              <Input
                onBlur={ClearLoad}
                placeholder="Inter your message..."
                value={newMessage || ""}
                mb={0.5}
                onChange={typeingHandler}
                bg={"#E0E0E0"}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          w={"100%"}
          h={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={"3xl"} pb={"3"} fontFamily={"Work sans"}>
            Click on a user to start
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
