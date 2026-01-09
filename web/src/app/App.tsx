import React from "react";
import { createBrowserRouter,RouterProvider } from "react-router";
import { router } from "./route";
import { Toaster } from "@/components/ui/sonner"

const App = () => {
    return (
        <>
            <RouterProvider router={router} />
            <Toaster />
        </>
        
    )
}

export default App;
