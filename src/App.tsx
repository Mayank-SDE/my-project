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
import { ClientAccounts } from "./components/ClientAccounts";
import { ManageAccount } from "./components/ManageAccount";
import { UpgradeFlow } from "./components/UpgradeFlow";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("/admin/dashboard");
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});
  const [isDark, setIsDark] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("s2m-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (savedTheme === null && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("s2m-theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  // Navigation helper
  const navigate = (route: string, params: Record<string, string> = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
  };

  // Get active section for sidebar
  const getActiveSection = () => {
    if (currentRoute.startsWith("/admin/dashboard")) return "dashboard";
    if (currentRoute.startsWith("/admin/users")) return "users";
    if (currentRoute.startsWith("/admin/requests")) return "requests";
    if (currentRoute.startsWith("/admin/subscriptions")) return "subscriptions";
    if (currentRoute.startsWith("/app/accounts")) return "accounts";
    return "dashboard";
  };

  const handleSectionChange = (section: string) => {
    switch (section) {
      case "dashboard":
        navigate("/admin/dashboard");
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "requests":
        navigate("/admin/requests");
        break;
      case "subscriptions":
        navigate("/admin/subscriptions");
        break;
      case "accounts":
        navigate("/app/accounts");
        break;
      default:
        navigate("/admin/dashboard");
    }
  };

  const renderContent = () => {
    switch (currentRoute) {
      case "/admin/dashboard":
        return <EnhancedDashboard navigate={navigate} />;
      
      case "/admin/users":
        return <UsersList navigate={navigate} />;
      
      case "/admin/users/detail":
        return <UserDetail userId={routeParams.id} navigate={navigate} />;
      
      case "/admin/requests":
        return <RequestsList navigate={navigate} />;
      
      case "/admin/requests/detail":
        return <RequestDetail requestId={routeParams.id} navigate={navigate} />;
      
      case "/admin/subscriptions":
        return <SubscriptionsList navigate={navigate} />;
      
      case "/app/accounts":
        return <ClientAccounts navigate={navigate} />;
      
      case "/app/accounts/manage":
        return <ManageAccount accountId={routeParams.id} navigate={navigate} />;
      
      case "/app/accounts/upgrade":
        return <UpgradeFlow accountId={routeParams.id} navigate={navigate} />;
      
      default:
        return <EnhancedDashboard navigate={navigate} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Header onThemeToggle={handleThemeToggle} isDark={isDark} currentRoute={currentRoute} />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeSection={getActiveSection()} 
          onSectionChange={handleSectionChange}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}