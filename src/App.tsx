import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigPage } from "./pages/ConfigPage";
import { DisplayPage } from "./pages/DisplayPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConfigPage />} />
        <Route path="/display" element={<DisplayPage />} />
      </Routes>
    </BrowserRouter>
  );
}
