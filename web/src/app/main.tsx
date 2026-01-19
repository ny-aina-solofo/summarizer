import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import App from './App';
import './globals.css';
import { makeStore } from "@/store/store";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={makeStore}>
            <App />
        </Provider>
    </StrictMode>,
)
