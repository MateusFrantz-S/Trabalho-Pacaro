import "./tailwind.css";
import "react-simple-toasts/dist/style.css";
import "react-simple-toasts/dist/theme/dark.css"; // Usa tema dark

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { toastConfig } from "react-simple-toasts";

toastConfig({ theme: "dark", duration: 3000 }); // Configura o toast para usar o tema dark e ser mais visível

createRoot(document.getElementById("root")!).render(<App />);
