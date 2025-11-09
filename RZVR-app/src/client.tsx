import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home";
import { AppContext } from "./worker";

const container = document.getElementById("root");
const root = createRoot(container!);

const ctx: AppContext = {
    user: { id: 1, name: "Sophia", email: "" }, 
    authUrl: "/login",
};

root.render(<Home ctx={ctx} />);