import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";
import { FormCraftStoreProvider } from "./store/FormCraftStoreProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FormCraftStoreProvider>
      <App />
    </FormCraftStoreProvider>
  </React.StrictMode>
);

// Start keep-alive to prevent Render from sleeping
// keepAlive.start();
