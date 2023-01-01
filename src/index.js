import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AutheContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AutheContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </AutheContextProvider>
  </React.StrictMode>
);
