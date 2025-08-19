import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  CreditCard,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    description: "Overview & analytics"
  },
  { 
    id: "analytics", 
    label: "Analytics", 
    icon: BarChart3,
    description: "Business insights"
  },
  { 
    id: "users", 
    label: "Users", 
    icon: Users,
    description: "Manage users"
  },
  { 
    id: "requests", 
    label: "Requests", 
    icon: FileText, 
    badge: "12",
    description: "Subscription requests"
  },
  { 
    id: "subscriptions", 
    label: "Subscriptions", 
    icon: CreditCard,
    description: "Manage subscriptions"
  },
  { 
    id: "accounts", 
    label: "Accounts", 
    icon: Building2,
    description: "Client accounts"
  },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Responsive: detect mobile using window width
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col bg-sidebar border-r transition-all duration-300",
        isCollapsed && !isMobile ? "w-16" : "w-72",
        isMobile ? "fixed bottom-0 left-0 w-full h-16 flex-row z-50 border-t border-r-0" : ""
      )}
      style={isMobile ? { minHeight: "4rem" } : {}}
    >
      {/* Collapse toggle (hide on mobile) */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-sm z-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      )}

      {/* Navigation */}
      <nav className={cn(
        "flex-1 p-2 sm:p-4",
        isMobile ? "flex flex-row items-center justify-between space-y-0 space-x-2 overflow-x-auto" : "space-y-2"
      )}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                isMobile
                  ? "min-w-[60px] h-12 px-2 flex-col items-center justify-center gap-1 text-xs"
                  : "w-full justify-start gap-3 h-12 rounded-xl transition-all",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm",
                isCollapsed && !isMobile ? "px-3 justify-center" : "px-4"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && !isMobile && (
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center",
                          isActive && "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className={cn(
                    "text-xs opacity-70 mt-0.5",
                    isActive ? "text-sidebar-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {item.description}
                  </p>
                </div>
              )}
              {isMobile && <span>{item.label}</span>}
              {item.badge && isMobile && (
                <Badge variant="secondary" className="ml-1">{item.badge}</Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer (hide on mobile) */}
      {!isCollapsed && !isMobile && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium">S2M Support Admin v2.0.0</div>
            <div className="mt-1">© 2025 S2M Technologies</div>
          </div>
        </div>
      )}
    </div>
  );
}
