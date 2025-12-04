import { useEffect, useState } from "react";
import { Display, type DisplayConfig } from "@/components/Display";

const channel = new BroadcastChannel("display-sync");
const LOCAL_STORAGE_KEY = "latestDisplayConfig";

export function DisplayPage() {
  const [config, setConfig] = useState<DisplayConfig>({
    text: "",
    textColor: "#ffffff",
    backgroundColor: "#000000",
  });

  useEffect(() => {
    // Listen for broadcasts from config page
    channel.onmessage = (event) => {
      setConfig(event.data);
    };

    // Load latest config from localStorage on mount
    const latest = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (latest) {
      try {
        setConfig(JSON.parse(latest));
      } catch (err) {
        console.error("Failed to parse latestDisplayConfig", err);
      }
    }

    document.title = "Marquee Display";
  }, []);

  return <Display config={config} fullScreen={true} />;
}
