"use client";

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
  theme,
} from "@chakra-ui/react";

async function notifyUser(notificationText = "Thank you for enabling notifications!") {
  if (!("Notification" in window)) {
    alert("Browser does not support notifications.");
  } else if (Notification.permission === "granted") {
    new Notification(notificationText);
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification(notificationText);
    }
  }
}

export default function Promt_Popup() {
  const [userResponded, setUserResponded] = useState(false);
  const [notificationSupported, setNotificationSupported] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationSupported(true);
    }
  }, []);

  async function enableNotifsAndClose() {
    await notifyUser();
    setUserResponded(true);
  }

  function disableNotifsAndClose() {
    setUserResponded(true);
  }

  if (!notificationSupported) {
    return (
      <ChakraProvider theme={theme}>
        <Container>
          <Box>
            <h1>Notifications are not supported by your browser.</h1>
          </Box>
        </Container>
      </ChakraProvider>
    );
  }

  return !userResponded && Notification.permission !== "granted" ? (
    // If Has not responded and notifications are not granted
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
          <Button colorScheme="gray" size="sm" onClick={disableNotifsAndClose}>
            No Thanks!
          </Button>
        </Alert>
      </Container>
    </ChakraProvider>
  ) : Notification.permission === "granted" ? (
    <ChakraProvider theme={theme}>
      <Container>
        <Box>
          <h1>Notifications are enabled.</h1>
        </Box>
      </Container>
    </ChakraProvider>
  ) : (
    <ChakraProvider theme={theme}>
      <Container>
        <Box>
          <h1>You have disabled notifications.</h1>
        </Box>
      </Container>
    </ChakraProvider>
  );
}
