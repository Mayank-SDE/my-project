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
  Activity,
  FileText,
  SendHorizonal,
  Wallet,
  AlertTriangle
} from "lucide-react";
import { useEffect, useState } from 'react';
import { getDerivedMetrics } from '../services/analyticsService';
import { eventBus, EVENTS } from '../services/eventBus';

// Static fallback structures used until real metrics; some charts still mock
const staticRevenueByMonth = [
  { month: 'Jul', revenue: 1200000 },
  { month: 'Aug', revenue: 1350000 },
  { month: 'Sep', revenue: 1420000 },
  { month: 'Oct', revenue: 1580000 },
  { month: 'Nov', revenue: 1650000 },
  { month: 'Dec', revenue: 1750000 },
  { month: 'Jan', revenue: 1820000 }
];

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState(getDerivedMetrics());
  useEffect(()=>{
    const update = () => setMetrics(getDerivedMetrics());
    const offs = [
      eventBus.on(EVENTS.ACCOUNTS_CHANGED, update),
      eventBus.on(EVENTS.SUBSCRIPTIONS_CHANGED, update),
      eventBus.on(EVENTS.REQUESTS_CHANGED, update),
      eventBus.on(EVENTS.INVOICES_CHANGED, update)
    ];
    return () => { offs.forEach(o=>o()); };
  },[]);

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

  // Simple derived arrays using metrics for dynamic charts (placeholder logic)
  const subscriptionDistribution = metrics.planDistribution.map(p => ({ name: p.plan, value: p.count, color: '#8884d8' }));
  const moduleUsage = [
    { module: 'Analytics', usage: 85, accounts: Math.round(metrics.totals.accounts*0.5) },
    { module: 'API', usage: 78, accounts: Math.round(metrics.totals.accounts*0.4) },
    { module: 'Integrations', usage: 65, accounts: Math.round(metrics.totals.accounts*0.3) }
  ];
  const paymentStatus = {
    successful: metrics.invoiceStatusCounts['PAID']||0,
    failed: metrics.invoiceStatusCounts['VOID']||0,
    pending: metrics.invoiceStatusCounts['SENT']||0
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
    <div className="text-2xl font-bold">{formatCurrency(metrics.totals.revenueInr)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
      Live paid invoice revenue
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totals.accounts)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Accounts (all plans)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totals.activeSubscriptions)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Active subscriptions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
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
            <div className="text-2xl font-bold">{metrics.totals.accounts? formatCurrency(Math.round(metrics.totals.revenueInr/metrics.totals.accounts)) : '₹0'}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +5.2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card><CardContent className="p-3 flex items-center justify-between"><span className="text-xs font-medium flex items-center gap-1"><FileText className="h-3 w-3" /> Draft Quotes</span><span className="text-sm font-semibold">{metrics.totals.draftQuotations}</span></CardContent></Card>
        <Card><CardContent className="p-3 flex items-center justify-between"><span className="text-xs font-medium flex items-center gap-1"><SendHorizonal className="h-3 w-3" /> Sent</span><span className="text-sm font-semibold">{metrics.invoiceStatusCounts['SENT']||0}</span></CardContent></Card>
        <Card><CardContent className="p-3 flex items-center justify-between"><span className="text-xs font-medium flex items-center gap-1"><Wallet className="h-3 w-3" /> Paid</span><span className="text-sm font-semibold">{metrics.invoiceStatusCounts['PAID']||0}</span></CardContent></Card>
        <Card><CardContent className="p-3 flex items-center justify-between"><span className="text-xs font-medium flex items-center gap-1 text-red-600"><AlertTriangle className="h-3 w-3" /> Overdue</span><span className="text-sm font-semibold text-red-600">{metrics.invoiceStatusCounts['OVERDUE']||0}</span></CardContent></Card>
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
                  <AreaChart data={staticRevenueByMonth}>
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
        <CardDescription>Current invoice distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Successful</span>
                  </div>
                  <div className="text-right">
          <p className="font-semibold">{formatNumber(paymentStatus.successful)}</p>
          <p className="text-xs text-muted-foreground">{paymentStatus.successful + paymentStatus.failed + paymentStatus.pending ===0 ? '0%' : formatPercentage((paymentStatus.successful /(paymentStatus.successful + paymentStatus.failed + paymentStatus.pending))*100)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Failed</span>
                  </div>
                  <div className="text-right">
          <p className="font-semibold">{formatNumber(paymentStatus.failed)}</p>
          <p className="text-xs text-muted-foreground">{paymentStatus.successful + paymentStatus.failed + paymentStatus.pending ===0 ? '0%' : formatPercentage((paymentStatus.failed /(paymentStatus.successful + paymentStatus.failed + paymentStatus.pending))*100)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="text-right">
          <p className="font-semibold">{formatNumber(paymentStatus.pending)}</p>
          <p className="text-xs text-muted-foreground">{paymentStatus.successful + paymentStatus.failed + paymentStatus.pending ===0 ? '0%' : formatPercentage((paymentStatus.pending /(paymentStatus.successful + paymentStatus.failed + paymentStatus.pending))*100)}</p>
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
                {[{ stage: 'Trial Signup', count: 1250, conversion: 100 },{ stage: 'Active Trial', count: 892, conversion: 71.4 },{ stage: 'Trial to Paid', count: 186, conversion: 14.9 }].map((stage) => (
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
                    <p className="text-2xl font-bold">12.8%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Customer LTV</p>
                    <p className="text-xs text-muted-foreground">Lifetime Value</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹156,000</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Churn Rate</p>
                    <p className="text-xs text-muted-foreground">Monthly Churn</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">3.2%</p>
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
                      data={subscriptionDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {subscriptionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={(entry as any).color} />
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
                  <BarChart data={moduleUsage}>
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
                  <BarChart data={subscriptionDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                      {subscriptionDistribution.map((entry:any, index:number) => (
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
              <div className="text-sm text-muted-foreground p-6">
                Geographic distribution placeholder (integrate real data later)
              </div>
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
                <div className="text-2xl font-bold">1,250</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  88.4%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2h</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.5%</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
