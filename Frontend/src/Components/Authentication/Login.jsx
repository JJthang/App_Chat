import {
  Box,
  Button,
  FormLabel,
  Input,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const handSubmit = async (e) => {
    const { data } = await axios.post("http://localhost:3000/api/login", e);
    if (data) {
      const { message, ...user } = data;
      const getUser = localStorage.setItem("user", JSON.stringify(user));
      alert(data.message);
      navigate("/chats");
    }
  };
  return (
    <VStack divider={<StackDivider borderColor="gray.200" />} align="stretch">
      <form
        style={{ width: "100%", height: "100%" }}
        onSubmit={handleSubmit(handSubmit)}
      >
        <Box h="100px">
          <FormLabel>email</FormLabel>
          <Input
            type="email"
            {...register("email")}
            placeholder="Enter your email..."
          />
        </Box>
        <Box h="100px">
          <FormLabel>password</FormLabel>
          <Input
            type="password"
            {...register("password")}
            placeholder="Enter your password..."
          />
        </Box>
        <Box h="50px">
          <Button type="submit" bg={"#1D5D9B"} color={"white"}>
            Login
          </Button>
        </Box>
      </form>
    </VStack>
  );
};

export default Login;
