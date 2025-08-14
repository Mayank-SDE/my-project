import { Search, Bell, Settings, User, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";

interface HeaderProps {
  onThemeToggle?: () => void;
  isDark?: boolean;
  currentRoute?: string;
}

export function Header({ onThemeToggle, isDark = false, currentRoute }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getBreadcrumb = () => {
    switch (currentRoute) {
      case "/admin/dashboard":
        return "Admin / Dashboard";
      case "/admin/users":
        return "Admin / Users";
      case "/admin/users/detail":
        return "Admin / Users / User Detail";
      case "/admin/requests":
        return "Admin / Requests";
      case "/admin/requests/detail":
        return "Admin / Requests / Request Detail";
      case "/admin/subscriptions":
        return "Admin / Subscriptions";
      case "/admin/subscriptions/detail":
        return "Admin / Subscriptions / Subscription Detail";
      case "/app/accounts":
        return "Client / Accounts";
      case "/app/accounts/manage":
        return "Client / Accounts / Manage Account";
      case "/app/accounts/upgrade":
        return "Client / Accounts / Upgrade";
      default:
        return "S2M Support";
    }
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side - Brand and Breadcrumb */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S2M</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">S2M Support Admin</h1>
              <div className="text-xs text-muted-foreground">
                {getBreadcrumb()}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs h-5 px-2">
            Production
          </Badge>
        </div>

        {/* Center - Global Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests, users, accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Right side - Notifications, User Menu, Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={onThemeToggle}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              12
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground">AU</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@s2m.com</p>
                  <Badge variant="outline" className="w-fit text-xs">Admin</Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
