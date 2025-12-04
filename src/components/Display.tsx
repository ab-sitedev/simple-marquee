import { useEffect, useState, useRef } from "react";

export interface DisplayConfig {
  text: string;
  textColor: string;
  backgroundColor: string;
  flash?: {
    enabled: boolean;
    ambientColor: string;
    interval: number;
  };
}

interface DisplayProps {
  config: DisplayConfig;
  fullScreen?: boolean;
  fitContainer?: boolean; // scale to container
}

export function Display({ config, fullScreen = false, fitContainer = false }: DisplayProps) {
  const [visible, setVisible] = useState(true);
  const flashInterval = useRef<number | null>(null);

  useEffect(() => {
    if (flashInterval.current !== null) {
      clearInterval(flashInterval.current);
      flashInterval.current = null;
    }

    if (config.flash?.enabled) {
      setVisible(true);
      flashInterval.current = window.setInterval(() => {
        setVisible((v) => !v);
      }, config.flash.interval);
    }

    return () => {
      if (flashInterval.current !== null) {
        clearInterval(flashInterval.current);
      }
    };
  }, [config]);

  const bgColor =
    config.flash?.enabled && !visible ? config.flash.ambientColor : config.backgroundColor;

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: config.textColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: fullScreen ? "100vw" : "100%",
        height: fullScreen ? "100vh" : "100%",
        transition: "background-color 0.2s",
        textAlign: "center",
        padding: fullScreen ? 32 : 0, // 32px padding when fullScreen
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          fontSize: fullScreen ? "10vw" : fitContainer ? "5vw" : "6rem",
          fontWeight: fullScreen ? 900 : "bold", // extra bold for full screen
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      >
        {config.text}
      </div>
    </div>
  );
}
