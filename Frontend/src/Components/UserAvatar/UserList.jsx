import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserList = ({ user, handFuntion }) => {
  return (
    <>
      <Box
        onClick={handFuntion}
        cursor="pointer"
        display={"flex"}
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white",
        }}
        w="100%"
        d="flex"
        alignItems="center"
        color="black"
        mt={2}
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Avatar
          mr={2}
          size={"sm"}
          cursor={"pointer"}
          name={user.name}
          src={user.pic}
        />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize={"xs"}>
            <b>Email : </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserList;
