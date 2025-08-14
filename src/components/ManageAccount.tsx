import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { 
  ArrowLeft, 
  Download,
  TrendingUp,
  X,
  Building2,
  Receipt,
  BarChart3,
  Package,
  Settings as SettingsIcon
} from "lucide-react";

// Sample data
const accountData = {
  id: "acc_001",
  name: "Acme Infrastructure Main",
  plan: "Enterprise Pro",
  billingCycle: "Yearly",
  status: "Active",
  startDate: "2025-01-15",
  endDate: "2026-01-15"
};

const invoicesData = [
  {
    invoiceNumber: "INV-2025-000042",
    date: "2025-01-15",
    amount: 11800,
    status: "Paid",
    downloadUrl: "#"
  },
  {
    invoiceNumber: "INV-2024-000001",
    date: "2024-01-15", 
    amount: 0,
    status: "Paid",
    downloadUrl: "#",
    isTrialInvoice: true
  }
];

interface ManageAccountProps {
  accountId: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function ManageAccount({ accountId, navigate }: ManageAccountProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/accounts")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">{accountData.name}</h1>
            <StatusBadge status={accountData.status as any} />
          </div>
          <p className="text-muted-foreground mt-1">
            {accountData.plan} • {accountData.billingCycle} billing
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate("/app/accounts/upgrade", { id: accountId })}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
          <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-destructive">
                <X className="h-4 w-4 mr-2" />
                Cancel Subscription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Subscription</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this subscription? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                  Keep Subscription
                </Button>
                <Button variant="destructive">
                  Cancel Subscription
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium">{accountData.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Billing Cycle</p>
                  <StatusBadge status={accountData.billingCycle as any} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{accountData.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{accountData.endDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Invoices & Receipts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesData.map((invoice) => (
                    <TableRow key={invoice.invoiceNumber}>
                      <TableCell className="font-mono">
                        {invoice.invoiceNumber}
                        {invoice.isTrialInvoice && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Trial
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status as any} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Usage analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Active Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Module management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Account settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
