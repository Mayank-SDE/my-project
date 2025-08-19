import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { StatusBadge } from "./StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Download, Eye, Settings, FileText, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { accountsService } from "../services/accountsService";
import type { Account } from "../types/domain";
import { FilterBar } from "./FilterBar";

interface AccountsListProps {
  onAccountSelect: (accountId: string) => void;
}

export function AccountsList({ onAccountSelect }: AccountsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planTypeFilter, setPlanTypeFilter] = useState("all");
  const [accountsData, setAccountsData] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let unsub: (()=>void)|undefined;
    const load = async () => {
      setLoading(true);
      const res = await accountsService.list();
      setAccountsData(res.data);
      setLoading(false);
      unsub = accountsService.onChange(async ()=>{
        const r = await accountsService.list();
        setAccountsData(r.data);
      });
    };
    load();
    return ()=> { if(unsub) unsub(); };
  },[]);

  const filteredAccounts = accountsData.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || account.subscriptionStatus.toLowerCase() === statusFilter;
    const matchesPlanType = planTypeFilter === "all" || account.planType === planTypeFilter;
    
    return matchesSearch && matchesStatus && matchesPlanType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Accounts</h1>
          <p className="text-muted-foreground">Manage customer accounts and subscriptions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            New Account
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <FilterBar
            search={{ value: searchQuery, onChange: setSearchQuery, placeholder: 'Search by name, owner, or email...' }}
            selects={[
              { config: { key: 'status', placeholder: 'Status', options: [
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'expired', label: 'Expired' },
                { value: 'cancelled', label: 'Cancelled' },
              ] }, value: statusFilter, onChange: setStatusFilter },
              { config: { key: 'plan', placeholder: 'Plan Type', options: [
                { value: 'all', label: 'All Plans' },
                { value: 'trial', label: 'Trial' },
                { value: 'paid', label: 'Paid' },
              ], width: 'w-36' }, value: planTypeFilter, onChange: setPlanTypeFilter }
            ]}
            resultsInfo={loading ? 'Loading...' : `${filteredAccounts.length} of ${accountsData.length} accounts`}
          />
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Details</TableHead>
                <TableHead>Current Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Limits</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading accounts...</TableCell></TableRow>}
              {!loading && filteredAccounts.map((account) => (
                <TableRow key={account.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {account.ownerName} • {account.ownerEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={account.planType === "trial" ? "secondary" : "default"}>
                        {account.planType === "trial" ? "Trial" : "Paid"}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        <StatusBadge status={account.billingCycle} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={account.subscriptionStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{account.maxUsers} users</div>
                      <div className="text-muted-foreground">{account.maxDataSizeGb}GB</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {account.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAccountSelect(account.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Open Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          Open Requests
                        </DropdownMenuItem>
                        {account.subscriptionStatus === "Active" && (
                          <DropdownMenuItem className="text-destructive">
                            Deactivate Account
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredAccounts.length===0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No accounts found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? 'Loading...' : `Showing 1-${filteredAccounts.length} of ${accountsData.length} accounts`}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
