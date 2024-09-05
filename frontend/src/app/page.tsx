"use client";


import React, { useEffect, useState } from "react";
import Home from "./home/page";
import PWAPrompt from "@/components/PWA/PWAPrompt";

declare global {
  interface WindowEventMap {
    beforeinstallprompt: Event;
  }
}

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as any;
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleCancelClick = () => {
    setShowInstallPrompt(false);
    console.log("User dismissed the custom install prompt");
  };

  return (
    <React.Fragment>
      <Home />
      {showInstallPrompt && (
        <PWAPrompt onInstall={handleInstallClick} onCancel={handleCancelClick} />
      )}
    </React.Fragment>
  );
}

export default App;
