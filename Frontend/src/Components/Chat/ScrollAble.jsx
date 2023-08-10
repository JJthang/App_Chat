import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  lastMessage,
  SenderMarginleft,
  isSameSender,
  senderMagrinTop,
} from "../config/ChatLogic.js";
import { ChatState } from "../../Context/chatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
// LastMessage,
const ScrollAble = ({ messages }) => {
  // console.log(messages);
  const { user } = ChatState();
  // console.log(user.user);

  return (
    <>
      <ScrollableFeed>
        {messages &&
          messages.map((item, index) => {
            // console.log(isSameSender(messages, item, index, user.user._id));
            return (
              <div style={{ display: "flex" }} key={index}>
                {(isSameSender(messages, item, index, user.user._id) ||
                  lastMessage(messages, index, user.user._id)) && (
                  <Tooltip label={item.sender.name} placement="bottom-start">
                    <Avatar
                      name={item.sender.name}
                      mr={1}
                      mt={1}
                      cursor="pointer"
                      size={"sm"}
                      src={item.sender.pic}
                    />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      item.sender._id === user.user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    marginLeft: SenderMarginleft(
                      messages,
                      item,
                      index,
                      user.user._id
                    ),
                    marginTop: senderMagrinTop(messages, item, index) ? 3 : 0,
                    marginBottom: senderMagrinTop(messages, item, index)
                      ? 3
                      : 10,
                  }}
                >
                  {item.content}
                </span>
              </div>
            );
          })}
      </ScrollableFeed>
    </>
  );
};

export default ScrollAble;
