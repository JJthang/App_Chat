import {
  Box,
  Button,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  Drawer,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import  { useState } from "react";
import {
  AiOutlineSearch,
  AiFillBell,
  AiOutlineArrowDown,
} from "react-icons/ai";
import { ChatState } from "../../Context/chatProvider";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading";
import UserList from "../UserAvatar/UserList";

const SliderDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const toat = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const navigate = useNavigate();
  const RemoveLocal = () => {
    alert("Đăng xuất thành công");
    localStorage.removeItem("user");
    navigate("/");
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        "http://localhost:3000/api/chat",
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(data);
      console.log([data, ...chats]);
      if (!chats.find((c) => c._id == data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toat({
        title: "Error Fetching the Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };

  const handSearch = async () => {
    if (!search) {
      toat({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/user?search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSearchResult(data.users);
      setLoading(false);
    } catch (error) {
      toat({
        title: "Error Occured",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bg: "white",
          w: "100%",
          p: "5px 10px 5px 10px",
          borderWidth: "5px",
        }}
      >
        <Tooltip label="Search User to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <AiOutlineSearch />
            <Text>Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Talk Together
        </Text>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Menu>
            <MenuButton p={1}>
              <AiFillBell fontSize={25} style={{ marginTop: "10px" }} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<AiOutlineArrowDown />}>
              <Avatar size={"sm"} cursor={"pointer"} name={user.user.name} />
            </MenuButton>
            <MenuList>
              <Profile user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profile>
              <MenuItem onClick={() => RemoveLocal()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottom={"1px"}>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"}>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />{" "}
              <Button ml={2} onClick={() => handSearch()}>
                Search
              </Button>
            </Box>
            {loading ? (
              <Loading />
            ) : (
              searchResult.map((user) => (
                <UserList
                  user={user}
                  key={user._id}
                  handFuntion={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SliderDrawer;
