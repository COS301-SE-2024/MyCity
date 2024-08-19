"use client";

import Home from "./home/page";
import React, { useEffect } from "react";
import { generateToken, messaging } from "@/components/Notifications/firebase";
import { onMessage } from "@firebase/messaging";

function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
    });
  }, []);

  return (
    <React.Fragment>
      <Home />
    </React.Fragment>
  );
}
export default App;
