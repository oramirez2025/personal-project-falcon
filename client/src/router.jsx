import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import TicketPage from "./pages/TicketPage";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import EventPage from "./pages/EventPage"
import LogInPage from "./pages/LogInPage";
import { userConfirmation } from "./utilities";

const router = createBrowserRouter([ 
{
    path: '/',
    element: <App />,
    loader: userConfirmation,
    children: [
        {
            index: true,
            element: <HomePage/>
        },
        {   
            path: 'tickets',
            element: <TicketPage/>
        },
        {
            path: 'signup',
            element: <SignUpPage/>
        },
        {
            path: 'events',
            element: <EventPage/>
        },
        {
            path: 'logIn',
            element: <LogInPage/>
        },


        ]


    


}
])

export default router;