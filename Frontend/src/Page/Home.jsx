import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login.jsx";
import Register from "../Components/Authentication/Register.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   if (user) {
  //     navigate("/chats");
  //   }
  // }, [navigate]);
  return (
    <Container width={"xl"} centerContent>
      <Box
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
        p={3}
        bg={"white"}
        width={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontSize={"4xl"} fontFamily={"Work sans"} color={"black"}>
          Hello
        </Text>
      </Box>
      <Box bg={"white"} w="100%" p={4} borderRadius={"lg"} borderWidth={"1px"}>
        <Tabs>
          <TabList>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
