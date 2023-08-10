import {} from "react";
import { ChatState } from "../../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

// eslint-disable-next-line react/prop-types, no-unused-vars
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  return (
    <>
      <Box
        d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        alignItems={"center"}
        flexDir={"column"}
        bg={"white"}
        w={{ base: "100%", md: "68%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </>
  );
};

export default ChatBox;
