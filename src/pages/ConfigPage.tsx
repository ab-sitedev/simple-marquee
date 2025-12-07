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
  const [interval, setInterval] = useState(750);

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
    <div className="flex h-screen">
      <aside className="flex flex-col gap-2 w-64 bg-stone-100 p-4 max-h-screen overflow-auto font-geist text-xs">

        <label>
          <span>Text:</span>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
          />
        </label>

        <label className="flex items-center space-x-2">
          <span>Text color:</span>
          <Input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="!w-9 !h-9 p-0 ml-auto flex-shrink-0"
          />
        </label>

        <label className="flex items-center space-x-2">
          <span>Background color:</span>
          <Input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="!w-9 !h-9 p-0 ml-auto flex-shrink-0"
          />
        </label>

        <label className="flex items-center">
          <span>Enable flash effect</span>
          <Checkbox
            checked={flashEnabled}
            onCheckedChange={(checked) => setFlashEnabled(!!checked)}
            className="ml-auto"
          />
        </label>

        {flashEnabled && (
          <>
            <label className="flex items-center space-x-2">
              <span>Ambient color:</span>
              <Input
                type="color"
                value={ambientColor}
                onChange={(e) => setAmbientColor(e.target.value)}
                className="!w-9 !h-9 p-0 ml-auto flex-shrink-0"
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

        <div className="flex flex-col gap-2">
          <Button onClick={handleSubmit} className="bg-green-500">
            Submit
          </Button>
          <Button onClick={handleClearDisplay} className="bg-red-500">
            Clear Display
          </Button>
        </div>

        <Button onClick={openDisplayWindow} className="mt-auto w-full">
          Open Display Window
        </Button>
      </aside>

      {/* Preview */}
      <main className="flex-1 max-h-screen overflow-auto p-4">
        <p style={{ marginBottom: 0 }}>Preview:</p>
        {previewConfig && (
          <div
            id="preview"
            className="max-h-full flex items-center justify-center"
            style={{ aspectRatio: "4/3", border: "1px solid #ccc", width: "100%" }}
          >
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <Display config={previewConfig} fitContainer />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}