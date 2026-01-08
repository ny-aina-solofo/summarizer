import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router'
// import { Provider } from "react-redux";
// import { store } from "./redux/store.js";
import App from './App'
import './globals.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
