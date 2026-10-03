import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import "./styles/header.css";
import "./styles/home.css";
import "./styles/about.css";
import "./styles/footer.css";
import "./styles/dashboard.css";
import "./styles/viewsection.css";
import "./styles/uploadsection.css";
import "./styles/scansection.css";
import "./styles/arsimulation.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
