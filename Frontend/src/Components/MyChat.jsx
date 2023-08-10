import { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";
import Loading from "./Loading";
import { getSender } from "./config/ChatLogic";
import GroupChatModel from "./GroupChatModel";

const MyChat = ({ fetchAgain }) => {
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
  const [loggerUser, setLoggerUser] = useState();
  const toats = useToast();
  // console.log(user.token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchChat = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // console.log(data);
      setChats(data);
    } catch (error) {
      toats({
        title: "Error Occured",
        description: "Failed to load the chat",
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggerUser(JSON.parse(localStorage.getItem("user")));
    fetchChat();
  }, [fetchAgain]);
  // console.log(chats);
  // console.log(selectedChat);
  // console.log(loggerUser);
  return (
    <>
      <Box
        d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir={"column"}
        alignItems={"center"}
        p={3}
        bg={"white"}
        w={{ base: "90%", md: "31%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Box
          pb={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily={"Work sans"}
          display={"flex"}
          w={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize={{ base: "17px", md: "15px", lg: "17px" }}>
            My Chat Boxs
          </Text>
          <GroupChatModel>
            <Button
              rightIcon={<IoIosAdd />}
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            >
              New Group Chat
            </Button>
          </GroupChatModel>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          bg={"#F8F8F8"}
          w={"100%"}
          h={"91%"}
          borderRadius={"lg"}
          overflow={"hidden"}
        >
          {chats ? (
            <Stack overflow={"scroll"}>
              {chats.map((item) => (
                <Box
                  key={item._id}
                  onClick={() => setSelectedChat(item)}
                  cursor={"pointer"}
                  bg={selectedChat == item ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat == item ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                >
                  <Text>
                    {!item.isGroupChat
                      ? getSender(loggerUser.user, item)
                      : item.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <Loading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChat;
