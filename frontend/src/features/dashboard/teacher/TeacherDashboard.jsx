import { DashboardHeader } from "./componentsDC/DashboardHeader";
import { DashboardStats } from "./componentsDC/DashboardStats";
import { PerformanceChart } from "./componentsDC/PerformanceChart";

export default function TeacherDashboard() {
  return (
    <div>
      <DashboardHeader />
      <DashboardStats />
      <PerformanceChart />
    </div>
  );
}
