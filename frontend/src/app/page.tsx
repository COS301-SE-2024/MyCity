"use client";

import Home from "./home/page";
import React, { useEffect } from "react";
// import { setupNotifications } from "@/components/Notifications/firebase";

import useVisibilityChange from "@/hooks/useVisibilityChange";

// root.render(
//   <App/>
// );



function App() {
  // const isForeground = useVisibilityChange();

  // if (isForeground) {
  //   // App is in the foreground, show toast notification
  //   toastNotification({
  //     title,
  //     description: body,
  //     status: "info",
  //   });
  // } else {
  // App is in the background, show native notification

  // useEffect(() => {
  //   const title = "";
  //   const body = "";
  //   sendNativeNotification({
  //     title,
  //     body,
  //   });
  // });
  return (
    <React.Fragment>
      <Home />
    </React.Fragment>
  );
}
export default App;
