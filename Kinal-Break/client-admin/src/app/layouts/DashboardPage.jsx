import { Outlet } from "react-router-dom";
import { DasboardContainer } from "../../shared/component/layout/DashboardContainer.jsx";

const DashboardPage = () => (
    <DasboardContainer>
        <Outlet />
    </DasboardContainer>
);
