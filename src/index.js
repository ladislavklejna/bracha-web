import React from "react";
import { createRoot } from "react-dom/client";

// Cormorant Garamond – used for headings (400, 600, 700 + italic)
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";

// Inter – used for body text (300, 400, 500 + 300 italic)
import "@fontsource/inter/300.css";
import "@fontsource/inter/300-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";

import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById("result");
const root = createRoot(container);
root.render(<App tab="home" />);

serviceWorkerRegistration.register();
