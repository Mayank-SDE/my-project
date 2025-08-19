import { useState, useEffect } from "react";
import "./styles/globals.css";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { RequestsList } from "./components/RequestsList";
import { RequestDetail } from "./components/RequestDetail";
import { UsersList } from "./components/UsersList";
import { UserDetail } from "./components/UserDetail";
import { SubscriptionsList } from "./components/SubscriptionsList";
import { EnhancedDashboard } from "./components/EnhancedDashboard";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { ClientAccounts } from "./components/ClientAccounts";
import { ManageAccount } from "./components/ManageAccount";
import { UpgradeFlow } from "./components/UpgradeFlow";
import { Toaster } from "./components/ui/sonner";
import { InvoicesList } from "./components/InvoicesList";
import { invoicesService } from "./services/invoicesService";



export default function App() {
  const [currentRoute, setCurrentRoute] = useState("/admin/dashboard");
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
// Theme toggle handler
const handleThemeToggle = () => {
  const newTheme = !isDark;
  setIsDark(newTheme);
  localStorage.setItem("s2m-theme", newTheme ? "dark" : "light");
  document.documentElement.classList.toggle("dark", newTheme);
};
  // Responsive: detect mobile using window width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
  const intervalId = setInterval(()=> invoicesService.simulateOverdue(), 15000); // demo: check every 15s
  return () => { window.removeEventListener("resize", handleResize); clearInterval(intervalId); };
  }, []);

  // Navigation helper
  const navigate = (route: string, params: Record<string, string> = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
  };

  // Get active section for sidebar
  const getActiveSection = () => {
    if (currentRoute.startsWith("/admin/dashboard")) return "dashboard";
    if (currentRoute.startsWith("/admin/analytics")) return "analytics";
    if (currentRoute.startsWith("/admin/users")) return "users";
    if (currentRoute.startsWith("/admin/requests")) return "requests";
  if (currentRoute.startsWith("/admin/invoices")) return "invoices";
    if (currentRoute.startsWith("/admin/subscriptions")) return "subscriptions";
    if (currentRoute.startsWith("/app/accounts")) return "accounts";
    return "dashboard";
  };

  // Handle section change
  const handleSectionChange = (section: string) => {
    switch (section) {
      case "dashboard":
        setCurrentRoute("/admin/dashboard");
        break;
      case "analytics":
        setCurrentRoute("/admin/analytics");
        break;
      case "users":
        setCurrentRoute("/admin/users");
        break;
      case "requests":
        setCurrentRoute("/admin/requests");
        break;
      case "invoices":
        setCurrentRoute("/admin/invoices");
        break;
      case "subscriptions":
        setCurrentRoute("/admin/subscriptions");
        break;
      case "accounts":
        setCurrentRoute("/app/accounts");
        break;
      default:
        setCurrentRoute("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onThemeToggle={handleThemeToggle}
        isDark={isDark}
        currentRoute={currentRoute}
      />
      <div className={isMobile ? "flex flex-col flex-1" : "flex flex-1"}>
        <Sidebar
          activeSection={getActiveSection()}
          onSectionChange={handleSectionChange}
        />
        <main className={isMobile ? "flex-1 overflow-y-auto pt-2 pb-20 px-2" : "flex-1 overflow-y-auto p-6"}>
          {/* Route rendering logic */}
          {currentRoute === "/admin/dashboard" && <EnhancedDashboard navigate={navigate} />}
          {currentRoute === "/admin/analytics" && <AnalyticsDashboard />}
          {currentRoute === "/admin/users" && <UsersList navigate={navigate} />}
          {currentRoute === "/admin/users/detail" && <UserDetail userId={routeParams.id} navigate={navigate} />}
          {currentRoute === "/admin/requests" && <RequestsList navigate={navigate} />}
          {currentRoute === "/admin/requests/detail" && <RequestDetail requestId={routeParams.id} navigate={navigate} />}
          {currentRoute === "/admin/invoices" && <InvoicesList />}
          {currentRoute === "/admin/subscriptions" && <SubscriptionsList navigate={navigate} />}
          {currentRoute === "/app/accounts" && <ClientAccounts navigate={navigate} />}
          {currentRoute === "/app/accounts/manage" && <ManageAccount accountId={routeParams.id} navigate={navigate} />}
          {currentRoute === "/app/accounts/upgrade" && <UpgradeFlow accountId={routeParams.id} navigate={navigate} />}
        </main>
      </div>
      <Toaster />
    </div>
  );     
}