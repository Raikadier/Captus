import MainLayoutDocente from "./MainLayoutDocente";
import DashboardHeader from "../componentsDc/DashboardHeader.jsx";
import DashboardStats from "../componentsDc/DashboardStats.jsx";
import PerformanceChart from "../componentsDc/PerformanceChart.jsx";

export default function TeacherDashboard() {
  return (
    <MainLayoutDocente>
      <DashboardHeader />
      <DashboardStats />
      <PerformanceChart />
    </MainLayoutDocente>
  );
}
