import { Badge } from "@chakra-ui/react";
import { TiDeleteOutline } from "react-icons/ti";

// eslint-disable-next-line react/prop-types
const UserBage = ({ user, handFuntion }) => {
  return (
    <>
      <Badge
        px={1}
        py={2}
        padding={"5px 15px"}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={"0.8rem"}
        colorScheme="purple"
        cursor="pointer"
        onClick={handFuntion}
        display={"flex"}
        zIndex={100000000}
      >
        {user.name}
        <TiDeleteOutline style={{ marginLeft: "5px", fontSize: "1.2rem" }} />
      </Badge>
    </>
  );
};

export default UserBage;
