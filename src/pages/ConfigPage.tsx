import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Display, type DisplayConfig } from "@/components/Display";

const channel = new BroadcastChannel("display-sync");

const LOCAL_STORAGE_KEY = "latestDisplayConfig";

export function ConfigPage() {
  const [text, setText] = useState("UNMUTE YOUR MIC");
  const [textColor, setTextColor] = useState("#ff0000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const [flashEnabled, setFlashEnabled] = useState(true);
  const [ambientColor, setAmbientColor] = useState("#000000");
  const [interval, setInterval] = useState(1000);

  const [previewConfig, setPreviewConfig] = useState<DisplayConfig | null>(null);

  // Load last config from localStorage on mount
  useEffect(() => {
    const latest = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (latest) {
      try {
        const parsed: DisplayConfig = JSON.parse(latest);
        setPreviewConfig(parsed);
      } catch (err) {
        console.error("Failed to parse latestDisplayConfig", err);
      }
    }
    document.title = "Marquee Config";
  }, []);

  const openDisplayWindow = () => {
    window.open(
      `${window.location.origin}/display`,
      "DisplayWindow",
      "width=800,height=600"
    );
  };

  const handleSubmit = () => {
    const config: DisplayConfig = {
      text,
      textColor,
      backgroundColor,
      flash: flashEnabled ? { enabled: true, ambientColor, interval } : undefined,
    };

    // Update preview
    setPreviewConfig(config);

    // Broadcast to open windows
    channel.postMessage(config);

    // Save to localStorage so new windows get it automatically
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  };

  const handleClearDisplay = () => {
    const clearConfig: DisplayConfig = {
      text: "",
      textColor: "#ffffff",
      backgroundColor: "#000000", // black screen
    };

    // Clear preview
    setPreviewConfig(clearConfig);

    // Broadcast to open windows
    channel.postMessage(clearConfig);

    // Clear localStorage so new windows start blank
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="p-6 space-y-4">
      <Button onClick={openDisplayWindow}>Open Display Window</Button>

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
      />

      <label className="flex items-center space-x-2">
        <span>Text color:</span>
        <Input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
      </label>

      <label className="flex items-center space-x-2">
        <span>Background color:</span>
        <Input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </label>

      <label className="flex items-center space-x-2">
        <Checkbox
          checked={flashEnabled}
          onCheckedChange={(checked) => setFlashEnabled(!!checked)}
        />
        <span>Enable flash effect</span>
      </label>

      {flashEnabled && (
        <>
          <label className="flex items-center space-x-2">
            <span>Ambient color:</span>
            <Input
              type="color"
              value={ambientColor}
              onChange={(e) => setAmbientColor(e.target.value)}
            />
          </label>

          <label className="flex items-center space-x-2">
            <span>Flash interval (ms):</span>
            <Input
              type="number"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
            />
          </label>
        </>
      )}

      <div className="space-x-2">
        <Button onClick={handleSubmit} className="bg-green-500">
          Submit
        </Button>
        <Button onClick={handleClearDisplay} className="bg-red-500">
          Clear Display
        </Button>
      </div>

      {/* Preview */}
      <p style={{ marginBottom: 0 }}>Preview:</p>
      {previewConfig && (
        <div className="w-full" style={{ aspectRatio: "4/3", border: "1px solid #ccc" }}>
          <Display config={previewConfig} fitContainer />
        </div>
      )}
    </div>
  );
}