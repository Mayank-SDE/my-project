import { useEffect, useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { MoreHorizontal, CreditCard, Calendar, DollarSign } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { subscriptionsService } from '../services/subscriptionsService';
import type { Subscription } from '../types/domain';
import { FilterBar } from './FilterBar';

interface SubscriptionsListProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function SubscriptionsList({ navigate }: SubscriptionsListProps) {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [plan, setPlan] = useState('all');

  useEffect(()=>{ let unsub: (()=>void)|undefined; const load=async()=>{ setLoading(true); const res= await subscriptionsService.list(); setSubs(res.data); setLoading(false); unsub = subscriptionsService.onChange(async()=>{ const r = await subscriptionsService.list(); setSubs(r.data); }); }; load(); return ()=>{ if(unsub) unsub(); }; },[]);

  const filtered = subs.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = s.customerName.toLowerCase().includes(q) || s.plan.toLowerCase().includes(q);
    const matchesStatus = status==='all' || s.status.toLowerCase()===status;
    const matchesPlan = plan==='all' || s.plan.toLowerCase()===plan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Manage customer subscriptions and billing</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-muted-foreground">79% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,420</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <FilterBar
            search={{ value: search, onChange: setSearch, placeholder: 'Search subscriptions...' }}
            selects={[
              { config: { key: 'status', placeholder: 'Status', options: [
                { value:'all', label:'All Status' },
                { value:'active', label:'Active' },
                { value:'expired', label:'Expired' },
                { value:'suspended', label:'Suspended' }
              ] }, value: status, onChange: setStatus },
              { config: { key: 'plan', placeholder: 'Plan', options: [
                { value:'all', label:'All Plans' },
                { value:'basic', label:'Basic' },
                { value:'professional', label:'Professional' },
                { value:'enterprise', label:'Enterprise' }
              ] }, value: plan, onChange: setPlan }
            ]}
            resultsInfo={loading ? 'Loading...' : `${filtered.length} of ${subs.length} subscriptions`}
          />
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <div className="space-y-4">
  {loading && <div className="text-center text-sm text-muted-foreground py-8">Loading subscriptions...</div>}
  {!loading && filtered.map((subscription) => (
          <Card key={subscription.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{subscription.customerName}</h3>
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="font-medium">{subscription.plan} Plan</span>
                    <span>{subscription.amount}</span>
                    <span>Next billing: {subscription.nextBilling}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {subscription.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => navigate("/admin/subscriptions/detail", { id: subscription.id })}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Subscription</DropdownMenuItem>
                    <DropdownMenuItem>Update Billing</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Cancel Subscription
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
  ))}
  {!loading && filtered.length===0 && <div className="text-center text-sm text-muted-foreground py-8">No subscriptions found</div>}
      </div>
    </div>
  );
}
