import { useState } from "react";
import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SliderDrawer from "../Components/miscellaneous/SliderDrawer";
import ChatBox from "../Components/Chat/ChatBox";
import MyChat from "../Components/MyChat";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  // console.log(user);

  return (
    <div style={{ width: "100%" }}>
      {user && <SliderDrawer />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "91vh",
          p: 10,
        }}
      >
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
