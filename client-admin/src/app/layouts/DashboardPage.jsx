import { Outlet } from "react-router-dom";
import { DasboardContainer } from "../../shared/component/layout/DashboardContainer.jsx";

export default function DashboardPage() {
  return (
    <DasboardContainer>
      <Outlet />
    </DasboardContainer>
  );
}
