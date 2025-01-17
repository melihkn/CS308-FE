import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Topbar from "../global/topbar";
import SideNavbar from "../global/sidenavbar";
import Contacts from "../contacts";
import Discounts from "../discounts";
import Products from "../products";
import Invoices from "../invoices";
import Refunds from "../refunds";
import ProfitLossPage from "../profitLoss";
import RevenueCostPage from "../revenueCost";
import Dashboard from "../dashboard";
import InvoiceViewer from "../../pages/InvoiceViewer.jsx"

function MainContent({ onLogout, userProfile }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <SideNavbar userProfile={userProfile}/>

      {/* Main Content */}
      <div
        style={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <CssBaseline />
        <Topbar onLogout={onLogout}/>
        <Routes>
          <Route path="" element={<Dashboard />} />
          <Route path="customers" element={<Contacts />} />
          <Route path="discounts" element={<Discounts />} />
          <Route path="prices" element={<Products />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="refunds" element={<Refunds />} />
          <Route path = "profitLoss" element = {<ProfitLossPage/>}/>
          <Route path = "revenueCost" element = {<RevenueCostPage/>}/>
          
        </Routes>
      </div>
    </div>
  );
}

export default MainContent;
