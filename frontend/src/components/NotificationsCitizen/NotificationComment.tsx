import React from "react";
import { User } from "lucide-react"; // Importing User icon from lucide-react
import {
  ChakraProvider,
  Container,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Box,
  Text,
  Button,
  theme,
  DarkMode,
  Heading,
  StackDivider,
  Stack,
  LightMode,
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

const CommentComponent = () => {
  return (
    // NotificationComment
    <div>
      {/* Comment Container */}
      <div className="flex border border-gray-300 w-full rounded-md p-4">
        {/* User Profile */}
        <div>
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
            <User size={32} color="#6B7280" />
          </div>
        </div>
        {/* Comment Content */}
        <div className="flex items-center text-opacity-80  justify-center">
          <div className="ml-4">
          <div className="font-bold">Kyle Marshall</div>
          <div className="text-md ">
            commented on a Ticket you made (SA0239):
          </div>
          {/* <div className="">Yes please fix this!!</div> */}
        </div>
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;
