import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { CreateReportPage } from "./pages/CreateReportPage";
import { ReportHistoryPage } from "./pages/ReportHistoryPage";
import { ReportDetailPage } from "./pages/ReportDetailPage";
import { GradeRecapPage } from "./pages/GradeRecapPage";
import { PrincipalDashboard } from "./pages/PrincipalDashboard";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: TeacherDashboard },
      { path: "create-report", Component: CreateReportPage },
      { path: "history", Component: ReportHistoryPage },
      { path: "report/:id", Component: ReportDetailPage },
      { path: "grades", Component: GradeRecapPage },
      { path: "principal", Component: PrincipalDashboard },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
