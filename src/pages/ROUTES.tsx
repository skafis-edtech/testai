import FeedbackPage from "./student/FeedbackPage";
import GradePage from "./student/GradePage";
import HomePage from "./student/HomePage";
import TestPage from "./student/TestPage";
import DashboardPage from "./teacher/DashboardPage";
import GradingPage from "./teacher/GradingPage";
import LoginPage from "./teacher/LoginPage";
import LogoutPage from "./teacher/LogoutPage";
import RecoverPasswordPage from "./teacher/RecoverPasswordPage";
import RegisterPage from "./teacher/RegisterPage";
import TestCreateEditPage from "./teacher/TestCreateEditPage";
import TestDashboardPage from "./teacher/TestDashboardPage";

export interface IRoute {
  path: string;
  title: string;
  element: JSX.Element;
}

export const routes: IRoute[] = [
  {
    path: "/",
    title: "Home",
    element: <HomePage />,
  },
  {
    path: "/test/:testCode/:studentId",
    title: "Test",
    element: <TestPage />,
  },
  {
    path: "/grade/:testCode/:studentId",
    title: "Grade",
    element: <GradePage />,
  },
  {
    path: "/feedback/:testCode/:studentId",
    title: "Feedback",
    element: <FeedbackPage />,
  },

  {
    path: "/dashboard",
    title: "Dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/login",
    title: "Login",
    element: <LoginPage />,
  },
  {
    path: "/logout",
    title: "Logout",
    element: <LogoutPage />,
  },
  {
    path: "/register",
    title: "Register",
    element: <RegisterPage />,
  },
  {
    path: "/recover-password",
    title: "Recover Password",
    element: <RecoverPasswordPage />,
  },
  {
    path: "/grading",
    title: "Grading",
    element: <GradingPage />,
  },
  {
    path: "test-dashboard",
    title: "Test Dashboard",
    element: <TestDashboardPage />,
  },
  {
    path: "test-create-edit",
    title: "Test Create Edit",
    element: <TestCreateEditPage />,
  },
  {
    path: "*",
    title: "Not Found",
    element: (
      <div>
        404 Not Found <a href="/">Go Home</a>
      </div>
    ),
  },
];
