import React, { useEffect } from "react";
import ReactDOM from 'react-dom/client';
import "./index.css";
import StickyNotes from "./StickyNotes";
import * as serviceWorker from "./serviceWorker";

const insertionPoint = document.createElement("div");
insertionPoint.id = "insertion-point";
document.body.parentNode.insertBefore(insertionPoint, document.body);

const SolPay = ReactDOM.createRoot(document.getElementById('insertion-point'));

// StickyNotes / content script
SolPay.render(
  <React.StrictMode>
    <StickyNotes />
  </React.StrictMode>
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();