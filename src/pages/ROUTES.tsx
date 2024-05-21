import SupportPage from "./SupportPage";
import UserGuidePage from "./UserGuidePage";
import FeedbackPage from "./student/FeedbackPage";
import GradePage from "./student/GradePage";
import HomePage from "./student/HomePage";
import TestPage from "./student/TestPage";
import DashboardPage from "./teacher/DashboardPage";
import ExportPage from "./teacher/ExportPage";
import GradingPage from "./teacher/GradingPage";
import LoginPage from "./teacher/LoginPage";
import LogoutPage from "./teacher/LogoutPage";
import RecoverPasswordPage from "./teacher/RecoverPasswordPage";
import RegisterPage from "./teacher/RegisterPage";
import TermsPage from "./teacher/TermsPage";
import TestCreateEditPage from "./teacher/TestCreateEditPage";
import TestDashboardPage from "./teacher/TestDashboardPage";

export interface IRoute {
  path: string;
  title: string;
  element: JSX.Element;
}

export const privateRoutes: IRoute[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/logout",
    title: "Logout",
    element: <LogoutPage />,
  },
  {
    path: "/grading/:testCode",
    title: "Grading",
    element: <GradingPage />,
  },
  {
    path: "/test-dashboard/:testCode",
    title: "Test Dashboard",
    element: <TestDashboardPage />,
  },
  {
    path: "/test-create-edit/:testCode",
    title: "Test Create Edit",
    element: <TestCreateEditPage />,
  },
  {
    path: "/export",
    title: "Export",
    element: <ExportPage />,
  },
];

export const publicRoutes: IRoute[] = [
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
    path: "/login",
    title: "Login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    title: "Register",
    element: <RegisterPage />,
  },
  {
    path: "/terms",
    title: "Taisyklės",
    element: <TermsPage />,
  },
  {
    path: "/recover-password",
    title: "Recover Password",
    element: <RecoverPasswordPage />,
  },
  {
    path: "/user-guide",
    title: "User Guide",
    element: <UserGuidePage />,
  },
  {
    path: "/support",
    title: "Support",
    element: <SupportPage />,
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

export const routes: IRoute[] = [...privateRoutes, ...publicRoutes];
