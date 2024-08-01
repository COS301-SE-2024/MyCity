import { Chakra_Petch } from "next/font/google";
import { ChakraProvider } from '@chakra-ui/react'
import Home from "./home/page";
import React from "react";

export default function App() {
  return (
    <ChakraProvider>
      <React.Fragment>
        <Home />
      </React.Fragment>
    </ChakraProvider>
  );
}
