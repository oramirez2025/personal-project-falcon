import { createBrowserRouter } from "react-router-dom";
import { userConfirmation } from "./utilities";
import App from "./App";
import UserProfile from "./pages/UserProfile";
import SignUpPage from "./pages/SignUpPage";
import EventsPage from "./pages/EventsPage"
import LogInPage from "./pages/LogInPage";
import TicketsPage from "./pages/TicketsPage";
import QuestionsAnswersPage from "./pages/QuestionAnswerPage";
import EventForumPage from "./pages/EventForumPage";
import CommentSection from "./components/sections/CommentSection";
import CommentThreadPage from "./pages/CommentThreadPage";
import ForumPage from "./pages/ForumPage";
import NotFoundPage from "./pages/NotFoundPage";

const falconLoader = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
        return null;
    } else {
        try {
            const user = await userConfirmation();
            return user
        } catch (e) {
            console.error(e)
            localStorage.removeItem('token')
            window.location.href = "/"
            return null
        }
    }

}

const router = createBrowserRouter([ 
{
    path: '/',
    element: <App/>,
    loader: falconLoader,
    children: [
        {
            index: true,
            element: <EventsPage/>
        },
        {
            path: 'signup',
            element: <SignUpPage/>
        },
        {
            path: "forum",
            element: <ForumPage/>,
            children: [
                {
                    path: "event/:eventId",
                    element: <EventForumPage/>,
                    children: [{
                        index: true, 
                        element: <CommentSection/>
                    },
                    {
                        path: "comments/:commentId",
                        element: <CommentThreadPage/>
                    }]
                },
            ]
        },
        {
            path: 'logIn',
            element: <LogInPage/>
        },
        {
            path: 'tickets',
            element: <TicketsPage/>
        },
        {
            path: 'profile',
            element: <UserProfile/>
        },
        {
            path: 'questions',
            element: <QuestionsAnswersPage/>
        }
    ],
        errorElement: <NotFoundPage/>
}
])

export default router;