import {
  Box,
  Button,
  FormLabel,
  Input,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";

const Register = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const { register, handleSubmit } = useForm();
  const PostDetail = async () => {
    setLoading(true);
    if (image === undefined) {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "demo-ECMA");
    data.append("cloud_name", "dsbiugddk");
    data.append("folder", "Upload_ECMA1");
    const takeData = await axios
      .post(`https://api.cloudinary.com/v1_1/dsbiugddk/image/upload`, data)
      .then((data) => data);
    return takeData.data.secure_url;
  };
  const handSubmit = async (e) => {
    e.pic = await PostDetail();
    axios
      .post("http://localhost:3000/api/register", e)
      .then(() => {
        alert("Dang ki thanh cong");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <VStack divider={<StackDivider borderColor="gray.200" />} align="stretch">
      <form
        style={{ width: "100%", height: "100%" }}
        onSubmit={handleSubmit(handSubmit)}
      >
        <Box h="100px">
          <FormLabel>name</FormLabel>
          <Input
            type="text"
            {...register("name")}
            placeholder="Enter your name..."
          />
        </Box>
        <Box h="100px">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            {...register("email")}
            placeholder="Enter your email..."
          />
        </Box>
        <Box h="100px">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            {...register("password")}
            placeholder="Enter your password..."
          />
        </Box>
        <Box h="100px">
          <FormLabel>Password</FormLabel>
          <Input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            p={"1.5"}
            placeholder="Enter your password..."
          />
        </Box>
        <Box h="50px">
          <Button type="submit" bg={"#1D5D9B"} color={"white"}>
            Register
          </Button>
        </Box>
      </form>
    </VStack>
  );
};

export default Register;
