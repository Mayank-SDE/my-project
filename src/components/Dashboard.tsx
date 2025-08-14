import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/button";
import { Eye, TrendingUp, Users, AlertCircle, Receipt, CreditCard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// Sample data
const kpiData = [
  { title: "Pending Requests", value: "12", icon: AlertCircle, trend: "+2 from yesterday", color: "text-amber-600" },
  { title: "Active Accounts", value: "147", icon: Users, trend: "+5 this week", color: "text-green-600" },
  { title: "Expiring Soon", value: "8", icon: AlertCircle, trend: "Next 30 days", color: "text-orange-600" },
  { title: "Invoices Sent", value: "23", icon: Receipt, trend: "This month", color: "text-blue-600" },
  { title: "Payments Received", value: "₹4,52,300", icon: CreditCard, trend: "+18% from last month", color: "text-green-600" },
];

const requestsChartData = [
  { name: "Pending", value: 12, fill: "#F59E0B" },
  { name: "Approved", value: 45, fill: "#16A34A" },
  { name: "Rejected", value: 8, fill: "#DC2626" },
  { name: "Cancelled", value: 3, fill: "#6B7280" },
];

const revenueChartData = [
  { month: "Jul", revenue: 385000 },
  { month: "Aug", revenue: 452300 },
  { month: "Sep", revenue: 398200 },
  { month: "Oct", revenue: 467800 },
  { month: "Nov", revenue: 523400 },
  { month: "Dec", revenue: 589600 },
];

const moduleUsageData = [
  { name: "Maps", value: 45, fill: "#2563EB" },
  { name: "Aerial Lidar", value: 28, fill: "#0EA5E9" },
  { name: "Rail Insights", value: 15, fill: "#16A34A" },
  { name: "AEC BIM", value: 12, fill: "#F59E0B" },
];

const recentDocuments = [
  {
    number: "QTN-2025-000001",
    type: "Quotation" as const,
    status: "Sent" as const,
    amount: "₹11,800",
    account: "Acme Infra",
    issuedAt: "2025-08-11",
  },
  {
    number: "INV-2025-000042", 
    type: "Invoice" as const,
    status: "Paid" as const,
    amount: "₹11,800",
    account: "Acme Infra",
    issuedAt: "2025-08-11",
  },
  {
    number: "RCT-2025-000042",
    type: "Invoice" as const,
    status: "Paid" as const,
    amount: "₹11,800", 
    account: "Acme Infra",
    issuedAt: "2025-08-11",
  },
  {
    number: "INV-2025-000099",
    type: "Credit Note" as const,
    status: "Sent" as const,
    amount: "₹5,000",
    account: "Vertex AEC",
    issuedAt: "2025-08-12",
  },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your support operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-semibold mt-1">{kpi.value}</p>
                    <p className={`text-xs mt-1 ${kpi.color}`}>
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      {kpi.trend}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Requests by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={requestsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Module Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Modules Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={moduleUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {moduleUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {moduleUsageData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recently Issued Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDocuments.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{doc.number}</TableCell>
                  <TableCell>
                    <StatusBadge type={doc.type} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={doc.status} />
                  </TableCell>
                  <TableCell className="font-medium">{doc.amount}</TableCell>
                  <TableCell>{doc.account}</TableCell>
                  <TableCell>{doc.issuedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
