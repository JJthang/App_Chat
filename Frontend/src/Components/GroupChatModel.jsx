import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../Context/chatProvider";
import axios from "axios";
import UserList from "./UserAvatar/UserList";
import UserBage from "./UserAvatar/UserBage";

// eslint-disable-next-line react/prop-types
const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState();
  const [selectUser, setSelectUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();
  const toat = useToast();
  // console.log(searchResult);
  const handleSearch = async (value) => {
    setSearch(value);
    if (!value) {
      return;
    }
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
        description: "Failed to Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  // console.log(chats);
  const handleGroup = (user) => {
    const lala = selectUser.includes(user);
    console.log(lala);
    if (selectUser.includes(user)) {
      toat({
        title: "User already to add",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectUser([...selectUser, user]);
  };
  // console.log(selectUser);
  const handDelete = (idUser) => {
    console.log("ahaha");
    const data = selectUser.filter((item) => item._id != idUser);
    console.log(data);
    setSelectUser(data);
  };
  const handleSubmit = async () => {
    if (!groupName || !selectUser) {
      toat({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/group`,
        {
          name: groupName,
          users: JSON.stringify(selectUser.map((item) => item._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      await setChats([data.fullGroupChat, ...chats]);
      onClose();
      toat({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toat({
        title: "Failed create to Chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ zIndex: "10000" }}>
          <ModalHeader textAlign={"center"}>Create Group Chat</ModalHeader>
          <FormControl p={5}>
            <FormLabel>Chat Name</FormLabel>
            <Input
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Chat Name"
            />

            <FormLabel>User : </FormLabel>
            <Input
              md={1}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Add User..."
            />
          </FormControl>
          <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
            {selectUser.length > 0
              ? selectUser.map((item) => (
                  <UserBage
                    key={item._id}
                    user={item}
                    handFuntion={() => handDelete(item._id)}
                  />
                ))
              : ""}
          </Box>
          {loading ? (
            <div>Loading ...</div>
          ) : (
            searchResult
              ?.slice(0, 3)
              .map((item) => (
                <UserList
                  key={item._id}
                  user={item}
                  handFuntion={() => handleGroup(item)}
                />
              ))
          )}
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={() => handleSubmit()}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
