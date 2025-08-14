import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { 
  Building2, 
  Plus, 
  Settings,
  Eye,
  TrendingUp
} from "lucide-react";

// Sample client accounts data
const accountsData = [
  {
    id: "acc_001",
    name: "Acme Infrastructure Main",
    plan: "Enterprise Pro",
    billingCycle: "Yearly",
    startDate: "2025-01-15",
    endDate: "2026-01-15", 
    status: "Active",
    isDefault: true
  },
  {
    id: "acc_002",
    name: "Acme Infrastructure Trial",
    plan: "Trial",
    billingCycle: "Monthly",
    startDate: "2025-01-10",
    endDate: "2025-02-10",
    status: "Active",
    isDefault: false
  }
];

interface ClientAccountsProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function ClientAccounts({ navigate }: ClientAccountsProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">My Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage your subscription accounts</p>
        </div>
        <Button onClick={() => navigate("/app/accounts", { action: "create" })}>
          <Plus className="h-4 w-4 mr-2" />
          New Account
        </Button>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountsData.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{account.name}</span>
                      {account.isDefault && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Default
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{account.plan}</TableCell>
                  <TableCell>
                    <StatusBadge status={account.billingCycle as any} />
                  </TableCell>
                  <TableCell className="text-sm">{account.startDate}</TableCell>
                  <TableCell className="text-sm">{account.endDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={account.status as any} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate("/app/accounts/manage", { id: account.id })}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </div>
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
