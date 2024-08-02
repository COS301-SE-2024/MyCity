'use client';

import React, { useEffect, useState } from "react";

import {
    ChakraProvider,
    Container,
    Alert,
    AlertIcon,
    AlertDescription,
    AlertTitle,
    Box,
    Button,
    Text,
    Link,
    VStack,
    Code,
    Grid,
    theme,
  } from "@chakra-ui/react";

  function notifyUser(
    notificationText = "Thank you for enabling notifications!"
  ) {
    if (!("Notification" in window)) {
      alert("Browser does not support notifications.");
    } else if (Notification.permission === "granted") {
      const notifications = new Notification(notificationText);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const notifications = new Notification(notificationText);
        }
      });
    }
  }

  export default function Notification_Promt() {
    const [userResponded, setUserResponded] = useState(false);

    function enableNotifsAndClose() {
        notifyUser();
        setUserResponded(true);
      }
      function diableNotifsAndClose() {
        setUserResponded(true);
      }

      return !(userResponded && !(Notification.permission === "granted")) ? (
        <ChakraProvider>
        <Container>
          <Alert status="success">
            <AlertIcon />
            <Box>
              <AlertTitle mr={2}>Notifications</AlertTitle>
              <AlertDescription>
                Would you like to receive notifications from MyCity?
              </AlertDescription>
            </Box>
            <Button colorScheme="blue" size="sm" onClick={enableNotifsAndClose}>
              Sure!
            </Button>
            <Button colorScheme="gray" size="sm" onClick={diableNotifsAndClose}>
              No Thanks!
            </Button>
            </Alert>
            </Container>
        </ChakraProvider>
      ) : (<div>  </div>)
  }
