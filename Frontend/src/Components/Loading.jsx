import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const Loading = () => {
  return (
    <>
      <Stack sx={{ mt: 5 }}>
        <Skeleton height={45} />
        <Skeleton height={45} />
        <Skeleton height={45} />
        <Skeleton height={45} />
        <Skeleton height={45} />
        <Skeleton height={45} />
        <Skeleton height={45} />
        <Skeleton height={45} />
        <Skeleton height={45} />
        <Skeleton height={45} />
      </Stack>
    </>
  );
};

export default Loading;
