import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import UserBage from "../UserAvatar/UserBage";
import axios from "axios";
import UserList from "../UserAvatar/UserList";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupName, setGroupName] = useState("");
  const [renameloading, setRenameLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log(selectedChat);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const toat = useToast();
  const handRemove = async (itemUser) => {
    // console.log(selectedChat.groupAdmin._id != user.user._id);
    // console.log(selectedChat.groupAdmin, user.user);
    // console.log(setcheck);
    if (selectedChat.groupAdmin._id != user.user._id) {
      toat({
        title: "Error Occured!",
        description: "Only admins can delete!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    try {
      setLoading(true);
      // console.log(selectedChat, itemUser);
      // console.log("lalalallalalall");
      const { data } = await axios.put(
        "http://localhost:3000/api/removegroup",
        {
          idChat: selectedChat._id,
          idUser: itemUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // console.log(itemUser);
      // console.log(data);
      // console.log(data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toat({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };
  const handRename = async () => {
    if (!groupName) return;
    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        `http://localhost:3000/api/renameGroup`,
        { chatId: selectedChat._id, chatName: groupName },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSelectedChat(data);
      //todo setFetchAgain(!fetchAgain) đẩy true lên reload lại Chat Box
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      onClose();
    } catch (error) {
      toat({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/user?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      toat({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  // console.log(selectedChat.groupAdmin._id, user.user._id);
  const handleAddUser = async (userItem) => {
    // console.log(userItem, selectedChat);
    if (selectedChat.users.find((item) => item._id == userItem._id)) {
      toat({
        title: "Error Occured!",
        description: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    // console.log(selectedChat.groupAdmin._id, user.user._id);
    if (selectedChat.groupAdmin._id != user.user._id) {
      toat({
        title: "Error Occured!",
        description: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    console.log(111);
    try {
      setLoading(true);
      const { data } = await axios.post(
        `http://localhost:3000/api/addgroup`,
        {
          chatId: selectedChat._id,
          idUser: userItem._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      userItem._id == user.user._id ? selectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toat({
        title: "Error Occured!",
        description: "Failed Add user to group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((item) => (
                <UserBage
                  key={item._id}
                  user={item}
                  handFuntion={() => handRemove(item)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder={"Chat name"}
                value={groupName}
                mb={3}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={() => handRename()}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Find someone to add to the group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner marginTop={2} size="md" />
            ) : (
              searchResult.map((item) => (
                <UserList
                  user={item}
                  key={item._id}
                  handFuntion={() => handleAddUser(item)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onClose}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
