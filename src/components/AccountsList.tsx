import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, Filter, Download, Eye, Settings, FileText, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Sample accounts data
const accountsData = [
  {
    id: "1",
    name: "Acme Infra",
    ownerName: "Priya Shah",
    ownerEmail: "priya@acme.com",
    planType: "paid",
    billingCycle: "Yearly" as const,
    subscriptionStatus: "Active" as const,
    maxUsers: 25,
    maxDataSize: "250GB",
    createdAt: "2025-07-18",
  },
  {
    id: "2", 
    name: "Nimbus Rail",
    ownerName: "Arjun Rao",
    ownerEmail: "arjun@nimbus.io",
    planType: "trial",
    billingCycle: "Monthly" as const,
    subscriptionStatus: "Active" as const,
    maxUsers: 5,
    maxDataSize: "50GB", 
    createdAt: "2025-08-02",
  },
  {
    id: "3",
    name: "Vertex AEC", 
    ownerName: "Meera Iyer",
    ownerEmail: "meera@vertex.aec",
    planType: "paid",
    billingCycle: "Monthly" as const,
    subscriptionStatus: "Suspended" as const,
    maxUsers: 10,
    maxDataSize: "120GB",
    createdAt: "2025-07-05",
  },
  {
    id: "4",
    name: "TechFlow Solutions",
    ownerName: "Raj Kumar", 
    ownerEmail: "raj@techflow.in",
    planType: "paid",
    billingCycle: "Yearly" as const,
    subscriptionStatus: "Expired" as const,
    maxUsers: 15,
    maxDataSize: "180GB",
    createdAt: "2025-06-15",
  },
  {
    id: "5",
    name: "Urban Dynamics",
    ownerName: "Lakshmi Nair",
    ownerEmail: "lakshmi@urbandyn.com", 
    planType: "trial",
    billingCycle: "Monthly" as const,
    subscriptionStatus: "Pending" as const,
    maxUsers: 5,
    maxDataSize: "50GB",
    createdAt: "2025-08-10",
  },
];

interface AccountsListProps {
  onAccountSelect: (accountId: string) => void;
}

export function AccountsList({ onAccountSelect }: AccountsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planTypeFilter, setPlanTypeFilter] = useState<string>("all");

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

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, owner, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Plan Type Filter */}
            <Select value={planTypeFilter} onValueChange={setPlanTypeFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Plan Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {filteredAccounts.length} of {accountsData.length} accounts
            </div>
          </div>
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
              {filteredAccounts.map((account) => (
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
                      <div className="text-muted-foreground">{account.maxDataSize}</div>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 1-{filteredAccounts.length} of {accountsData.length} accounts
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
