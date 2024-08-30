"use client";

import Home from "./home/page";
import React, { useEffect, useState } from "react";
import PWAPrompt from "@/components/PWA/PWAPrompt";

// Define the BeforeInstallPromptEvent type
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true); 
    };

    // Cast "beforeinstallprompt" to string
    window.addEventListener("beforeinstallprompt" as string, handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt" as string, handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
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
    <>
      <Home />
      {showInstallPrompt && (
        <PWAPrompt 
          onInstall={handleInstallClick} 
          onCancel={handleCancelClick} 
        />
      )}
    </>
  );
}

export default App;
