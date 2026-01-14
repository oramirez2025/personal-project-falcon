import { createBrowserRouter } from "react-router-dom";
import { userConfirmation } from "./utilities";
import App from "./App";
import UserProfile from "./pages/UserProfile";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import TicketsPage from "./pages/TicketsPage";
import QuestionsAnswersPage from "./pages/QuestionAnswerPage";
import NotFoundPage from "./pages/NotFoundPage";

// Forum Pages
import ForumPage from "./pages/ForumPage";
import ConventionPage from "./pages/ConventionPage";
import TavernPage from "./pages/TavernPage";
import EventForumPage from "./pages/EventForumPage";

const falconLoader = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  } else {
    try {
      const user = await userConfirmation();
      return user;
    } catch (e) {
      console.error(e);
      localStorage.removeItem("token");
      window.location.href = "/";
      return null;
    }
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: falconLoader,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      // condensed to homepage
      // {
      //   path: "events",
      //   element: <EventsPage />,
      // },
      {
        path: "logIn",
        element: <LogInPage />,
      },
      // condensed to homepage
      // {
      //   path: "tickets",
      //   element: <TicketsPage />,
      // },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "questions",
        element: <QuestionsAnswersPage />,
      },
      // ========== FORUM ROUTES ==========
      {
        path: "forum",
        children: [
          {
            index: true,
            element: <ForumPage />,
          },
          {
            path: "convention/:year",
            children: [
              {
                index: true,
                element: <ConventionPage />,
              },
              {
                path: "general",
                element: <TavernPage />,
              },
            ],
          },
          {
            path: "event/:eventId",
            element: <EventForumPage />,
          },
        ],
      },
      // ========== 404 ==========
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
