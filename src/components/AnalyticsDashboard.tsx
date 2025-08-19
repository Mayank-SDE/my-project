import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown,
  Building2, 
  CreditCard, 
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Target,
  Zap,
  Activity
} from "lucide-react";

// Comprehensive analytics data based on schema
const analyticsData = {
  kpis: {
    totalRevenue: 15750000,
    revenueGrowth: 23.5,
    totalAccounts: 847,
    accountsGrowth: 18.2,
    activeSubscriptions: 752,
    subscriptionGrowth: 15.8,
    churnRate: 3.2,
    avgRevenuePerAccount: 18600,
    conversionRate: 12.8,
    customerLifetimeValue: 156000
  },
  
  revenueByMonth: [
    { month: 'Jul', revenue: 1200000, subscriptions: 95, trials: 45 },
    { month: 'Aug', revenue: 1350000, subscriptions: 108, trials: 52 },
    { month: 'Sep', revenue: 1420000, subscriptions: 125, trials: 48 },
    { month: 'Oct', revenue: 1580000, subscriptions: 142, trials: 55 },
    { month: 'Nov', revenue: 1650000, subscriptions: 158, trials: 62 },
    { month: 'Dec', revenue: 1750000, subscriptions: 175, trials: 58 },
    { month: 'Jan', revenue: 1820000, subscriptions: 192, trials: 65 }
  ],
  
  subscriptionDistribution: [
    { name: 'Basic', value: 245, amount: 2450000, color: '#8884d8' },
    { name: 'Professional', value: 312, amount: 6240000, color: '#82ca9d' },
    { name: 'Enterprise', value: 195, amount: 7060000, color: '#ffc658' }
  ],
  
  geographicDistribution: [
    { region: 'North America', accounts: 285, revenue: 6200000 },
    { region: 'Europe', accounts: 198, revenue: 4100000 },
    { region: 'Asia Pacific', accounts: 245, revenue: 3800000 },
    { region: 'Others', accounts: 119, revenue: 1650000 }
  ],
  
  customerJourney: [
    { stage: 'Trial Signup', count: 1250, conversion: 100 },
    { stage: 'Active Trial', count: 892, conversion: 71.4 },
    { stage: 'Trial to Paid', count: 186, conversion: 14.9 },
    { stage: 'Active Paid', count: 752, conversion: 60.2 },
    { stage: 'Renewed', count: 645, conversion: 85.8 }
  ],
  
  paymentStatus: {
    successful: 892,
    failed: 45,
    pending: 23,
    totalAmount: 15750000
  },
  
  moduleUsage: [
    { module: 'Advanced Analytics', usage: 85, accounts: 425 },
    { module: 'API Access', usage: 78, accounts: 390 },
    { module: 'Priority Support', usage: 92, accounts: 195 },
    { module: 'Custom Integrations', usage: 65, accounts: 325 },
    { module: 'Bulk Operations', usage: 58, accounts: 290 }
  ],
  
  supportMetrics: {
    totalTickets: 1250,
    resolvedTickets: 1105,
    avgResolutionTime: 4.2,
    customerSatisfaction: 94.5,
    escalatedTickets: 28
  }
};

export function AnalyticsDashboard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Business Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your subscription business performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.kpis.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{formatPercentage(analyticsData.kpis.revenueGrowth)} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.kpis.totalAccounts)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{formatPercentage(analyticsData.kpis.accountsGrowth)} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.kpis.activeSubscriptions)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{formatPercentage(analyticsData.kpis.subscriptionGrowth)} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(analyticsData.kpis.churnRate)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              -0.8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Account</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.kpis.avgRevenuePerAccount)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +5.2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and subscription growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Revenue' : 'Subscriptions'
                    ]} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Current payment distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Successful</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatNumber(analyticsData.paymentStatus.successful)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage((analyticsData.paymentStatus.successful / (analyticsData.paymentStatus.successful + analyticsData.paymentStatus.failed + analyticsData.paymentStatus.pending)) * 100)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Failed</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatNumber(analyticsData.paymentStatus.failed)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage((analyticsData.paymentStatus.failed / (analyticsData.paymentStatus.successful + analyticsData.paymentStatus.failed + analyticsData.paymentStatus.pending)) * 100)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatNumber(analyticsData.paymentStatus.pending)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage((analyticsData.paymentStatus.pending / (analyticsData.paymentStatus.successful + analyticsData.paymentStatus.failed + analyticsData.paymentStatus.pending)) * 100)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Analytics */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Journey Funnel</CardTitle>
                <CardDescription>Conversion rates through customer lifecycle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.customerJourney.map((stage) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <div className="text-right">
                        <span className="font-semibold">{formatNumber(stage.count)}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({formatPercentage(stage.conversion)})
                        </span>
                      </div>
                    </div>
                    <Progress value={stage.conversion} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Customer Metrics</CardTitle>
                <CardDescription>Important customer-related KPIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Conversion Rate</p>
                    <p className="text-xs text-muted-foreground">Trial to Paid</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatPercentage(analyticsData.kpis.conversionRate)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Customer LTV</p>
                    <p className="text-xs text-muted-foreground">Lifetime Value</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatCurrency(analyticsData.kpis.customerLifetimeValue)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Churn Rate</p>
                    <p className="text-xs text-muted-foreground">Monthly Churn</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatPercentage(analyticsData.kpis.churnRate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscription Analytics */}
        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Revenue and accounts by plan type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.subscriptionDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {analyticsData.subscriptionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Module Usage</CardTitle>
                <CardDescription>Feature adoption across customer base</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.moduleUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="module" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accounts by Subscription Type</CardTitle>
                <CardDescription>Bar chart of accounts per subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.subscriptionDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                      {analyticsData.subscriptionDistribution.map((entry, index) => (
                        <Cell key={`cell-bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Example: Pie chart for request types (dummy data) */}
            <Card>
              <CardHeader>
                <CardTitle>Request Types</CardTitle>
                <CardDescription>Distribution of request types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Upgrade', value: 120, color: '#8884d8' },
                        { name: 'Downgrade', value: 45, color: '#82ca9d' },
                        { name: 'Cancel', value: 32, color: '#ffc658' },
                        { name: 'Other', value: 18, color: '#ff7f50' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {[
                        { name: 'Upgrade', value: 120, color: '#8884d8' },
                        { name: 'Downgrade', value: 45, color: '#82ca9d' },
                        { name: 'Cancel', value: 32, color: '#ffc658' },
                        { name: 'Other', value: 18, color: '#ff7f50' }
                      ].map((entry, index) => (
                        <Cell key={`cell-req-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geographic Analytics */}
        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Revenue and customer distribution by region</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.geographicDistribution} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="region" type="category" width={100} />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(Number(value)) : value,
                    name === 'revenue' ? 'Revenue' : 'Accounts'
                  ]} />
                  <Bar dataKey="accounts" fill="#8884d8" />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Analytics */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.supportMetrics.totalTickets)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPercentage((analyticsData.supportMetrics.resolvedTickets / analyticsData.supportMetrics.totalTickets) * 100)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.supportMetrics.avgResolutionTime}h</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(analyticsData.supportMetrics.customerSatisfaction)}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
