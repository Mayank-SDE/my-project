import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { 
  Users, 
  Building2, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MoreHorizontal,
  Download
} from "lucide-react";
import { InvoiceModal } from "./InvoiceModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface EnhancedDashboardProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

// Enhanced dummy data based on your schema
const dashboardData = {
  overview: {
    totalAccounts: 156,
    activeSubscriptions: 128,
    pendingRequests: 23,
    monthlyRevenue: 387650,
    trialAccounts: 45,
    paidAccounts: 111,
    growth: {
      accounts: 12.5,
      revenue: 8.3,
      subscriptions: 15.2
    }
  },
  subscriptionStatus: {
    active: 128,
    pending: 12,
    suspended: 8,
    expired: 8,
    cancelled: 4
  },
  recentRequests: [
    {
      id: "req-001",
      type: "CREATE_PAID_ACCOUNT",
      accountName: "TechStart Solutions",
      requesterName: "John Smith",
      requestedPlan: "Professional",
      amount: 12999,
      status: "PENDING",
      createdAt: "2025-01-14T10:30:00Z"
    },
    {
      id: "req-002", 
      type: "UPGRADE_SUBSCRIPTION",
      accountName: "Digital Dynamics",
      requesterName: "Sarah Johnson",
      requestedPlan: "Enterprise",
      amount: 29999,
      status: "APPROVED",
      createdAt: "2025-01-14T09:15:00Z"
    },
    {
      id: "req-003",
      type: "CANCEL_SUBSCRIPTION", 
      accountName: "Quick Labs",
      requesterName: "Mike Wilson",
      requestedPlan: "Basic",
      amount: 0,
      status: "REJECTED",
      createdAt: "2025-01-13T16:45:00Z"
    }
  ],
  expiringSubscriptions: [
    {
      id: "sub-001",
      accountName: "Acme Corporation",
      plan: "Enterprise",
      expirationDate: "2025-01-20",
      daysLeft: 6,
      amount: 29999
    },
    {
      id: "sub-002",
      accountName: "Global Solutions",
      plan: "Professional", 
      expirationDate: "2025-01-25",
      daysLeft: 11,
      amount: 12999
    },
    {
      id: "sub-003",
      accountName: "Innovation Hub",
      plan: "Basic",
      expirationDate: "2025-01-28",
      daysLeft: 14,
      amount: 4999
    }
  ],
  recentPayments: [
    {
      id: "pay-001",
      accountName: "TechCorp Industries",
      amount: 29999,
      status: "Success",
      method: "NEFT",
      date: "2025-01-14T08:30:00Z"
    },
    {
      id: "pay-002",
      accountName: "StartUp Valley",
      amount: 12999,
      status: "Success", 
      method: "UPI",
      date: "2025-01-13T14:20:00Z"
    },
    {
      id: "pay-003",
      accountName: "Business Hub",
      amount: 4999,
      status: "Failed",
      method: "Card",
      date: "2025-01-13T11:10:00Z"
    }
  ]
};

export function EnhancedDashboard({ navigate }: EnhancedDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "success":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "suspended":
      case "failed":
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "expired":
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "success":
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "suspended":
      case "failed":
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "expired":
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Subscription Management Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor trial and paid subscriptions, manage customer requests, and track revenue
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.totalAccounts}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{dashboardData.overview.growth.accounts}% from last month
            </div>
            <div className="mt-2 text-xs">
              <span className="text-green-600 font-medium">{dashboardData.overview.paidAccounts} Paid</span>
              <span className="mx-2">•</span>
              <span className="text-blue-600 font-medium">{dashboardData.overview.trialAccounts} Trial</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.activeSubscriptions}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{dashboardData.overview.growth.subscriptions}% from last month
            </div>
            <Progress 
              value={(dashboardData.subscriptionStatus.active / dashboardData.overview.totalAccounts) * 100} 
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.pendingRequests}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" />
              Require attention
            </div>
            <Button 
              variant="link" 
              className="mt-1 h-auto p-0 text-xs"
              onClick={() => navigate("/admin/requests")}
            >
              Review requests →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.overview.monthlyRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{dashboardData.overview.growth.revenue}% from last month
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Target: {formatCurrency(500000)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status Distribution</CardTitle>
          <CardDescription>Current status of all subscriptions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(dashboardData.subscriptionStatus).map(([status, count]) => (
              <div key={status} className="text-center p-4 rounded-lg border">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(status)}
                </div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">{status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscription Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Subscription Requests</CardTitle>
                <CardDescription>Latest customer subscription requests requiring action</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/requests")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{request.accountName}</span>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status}</span>
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {request.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} • {request.requestedPlan}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    By {request.requesterName} • {formatDate(request.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(request.amount)}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate("/admin/requests/detail", { id: request.id })}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <InvoiceModal
                        type="QUOTATION"
                        subscriptionRequestId={request.id}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Quotation
                          </DropdownMenuItem>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expiring Subscriptions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Expiring Subscriptions</CardTitle>
                <CardDescription>Subscriptions expiring in the next 30 days</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/subscriptions")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.expiringSubscriptions.map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{subscription.accountName}</span>
                    <Badge variant="outline">{subscription.plan}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires {formatDate(subscription.expirationDate)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {subscription.daysLeft} days remaining
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(subscription.amount)}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Subscription
                      </DropdownMenuItem>
                      <InvoiceModal
                        type="INVOICE"
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Renewal Invoice
                          </DropdownMenuItem>
                        }
                      />
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Send Reminder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payment Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Payment Transactions</CardTitle>
              <CardDescription>Latest payment activities across all accounts</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All Payments
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${payment.status === 'Success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {payment.status === 'Success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium">{payment.accountName}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.method} • {formatDate(payment.date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(payment.amount)}</div>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InvoiceModal
              type="QUOTATION"
              trigger={
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">New Quotation</span>
                </Button>
              }
            />
            <InvoiceModal
              type="INVOICE"
              trigger={
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">New Invoice</span>
                </Button>
              }
            />
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate("/admin/users")}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate("/admin/subscriptions")}
            >
              <CreditCard className="h-6 w-6" />
              <span className="text-sm">View Subscriptions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
