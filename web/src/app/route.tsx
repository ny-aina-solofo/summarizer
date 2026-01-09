import { createBrowserRouter } from "react-router";
import HomePage from "@/pages/HomePage";

export const router = createBrowserRouter([
    { path:"/", element: <HomePage />},
    // {
    //     path:"/signup",
    //     element: <SignUpPage />
    // },
    // {
    //     path: "/dashboard",
    //     element: <DashboardLayout />,
    //     children: [
    //         {
    //             index:true ,
    //             element: <Dashboard />,
    //         },
            
    //         {
    //             path: "transactions",
    //             element: <TransactionPage />,
    //         },

    //         {
    //             path: "expenses", 
    //             element: <ExpensesPage />,
    //         },

    //         {
    //             path: "budgets", 
    //             element: <BudgetPage />,
    //         },
    //         {
    //             path: "users-settings", 
    //             element: <UserSettingsPage />,
    //         },
    //     ],
    // },
]);