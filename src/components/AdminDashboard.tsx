import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { StatusBadge } from "./StatusBadge";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { 
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause,
  CalendarDays
} from "lucide-react";

// Sample data
const kpiData = [
  { 
    title: "Pending Requests", 
    value: "12", 
    icon: AlertCircle, 
    trend: "+3 from yesterday", 
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  { 
    title: "Approved", 
    value: "45", 
    icon: CheckCircle, 
    trend: "+8 this week", 
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  { 
    title: "Rejected", 
    value: "8", 
    icon: XCircle, 
    trend: "+2 this week", 
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  { 
    title: "Suspended", 
    value: "3", 
    icon: Pause, 
    trend: "No change", 
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  { 
    title: "Expired", 
    value: "15", 
    icon: CalendarDays, 
    trend: "+5 this month", 
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  },
];

const slaData = [
  {
    title: "Avg Handling Time",
    value: "2.4 hours",
    target: "< 4 hours",
    status: "good" as const,
  },
  {
    title: "On-time Completion",
    value: "94.2%",
    target: "> 90%",
    status: "good" as const,
  },
];

const requestsOverTimeData = [
  { month: "Jan", requests: 32 },
  { month: "Feb", requests: 28 },
  { month: "Mar", requests: 45 },
  { month: "Apr", requests: 38 },
  { month: "May", requests: 52 },
  { month: "Jun", requests: 47 },
  { month: "Jul", requests: 65 },
  { month: "Aug", requests: 58 },
];

const pendingByTypeData = [
  { type: "New Account", count: 5, fill: "#3B82F6" },
  { type: "Upgrade", count: 4, fill: "#8B5CF6" },
  { type: "Cancel", count: 3, fill: "#EF4444" },
];

interface AdminDashboardProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function AdminDashboard({ navigate }: AdminDashboardProps) {
  const [dateRange, setDateRange] = useState("30d");
  const [requestType, setRequestType] = useState("all");
  const [status, setStatus] = useState("all");

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Admin overview and key metrics</p>
        </div>
        
        {/* Global Filters */}
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={requestType} onValueChange={setRequestType}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Request Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="new">New Account</SelectItem>
              <SelectItem value="upgrade">Upgrade</SelectItem>
              <SelectItem value="cancel">Cancel</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={kpi.title} 
              className={cn(
                "cursor-pointer hover:shadow-md transition-all duration-200 border-2",
                kpi.borderColor
              )}
              onClick={() => navigate("/admin/requests")}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold mb-2">{kpi.value}</p>
                    <p className={cn("text-xs flex items-center", kpi.color)}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {kpi.trend}
                    </p>
                  </div>
                  <div className={cn("p-2 rounded-lg", kpi.bgColor)}>
                    <Icon className={cn("h-5 w-5", kpi.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Requests Over Time */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Requests Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={requestsOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  dot={{ fill: "#2563EB", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending by Type */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending by Request Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pendingByTypeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Quick actions */}
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate("/admin/requests")}
              >
                View All Pending Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slaData.map((sla) => (
          <Card key={sla.title}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {sla.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{sla.value}</p>
                  <p className="text-sm text-muted-foreground">Target: {sla.target}</p>
                </div>
                <StatusBadge status="Active" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
