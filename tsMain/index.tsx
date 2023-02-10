import "../scss/style.scss"
import "bootstrap/dist/js/bootstrap"

import React from "react";
import {createRoot} from "react-dom/client";
import {App} from "./App";

const app = createRoot(document.getElementById("app"))
app.render(<App />)