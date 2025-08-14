import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { StatusBadge } from "./StatusBadge";
import { InvoiceModal } from "./InvoiceModal";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  DollarSign,
  User,
  MoreHorizontal,
  FileText
} from "lucide-react";
import { Badge } from "./ui/badge";

// Sample requests data
const requestsData = [
  {
    id: "REQ-2025-001",
    user: {
      name: "Priya Shah",
      email: "priya@acme.com",
      company: "Acme Infra"
    },
    type: "New Account" as const,
    quoteAmount: 11800,
    status: "Pending" as const,
    createdAt: "2025-01-15",
    requestedBilling: "Yearly",
    requestedMaxUser: 25,
    requestedMaxDataSize: 250,
    requestedModules: ["Maps", "Reporting"]
  },
  {
    id: "REQ-2025-002",
    user: {
      name: "Arjun Rao", 
      email: "arjun@nimbus.io",
      company: "Nimbus Rail"
    },
    type: "Upgrade" as const,
    quoteAmount: 8500,
    status: "Approved" as const,
    createdAt: "2025-01-14",
    requestedBilling: "Monthly",
    requestedMaxUser: 50,
    requestedMaxDataSize: 500,
    requestedModules: ["Maps", "AerialMapper"]
  },
  {
    id: "REQ-2025-003",
    user: {
      name: "Meera Iyer",
      email: "meera@vertex.aec", 
      company: "Vertex AEC"
    },
    type: "Cancel" as const,
    quoteAmount: 0,
    status: "Rejected" as const,
    createdAt: "2025-01-13",
    requestedBilling: "",
    requestedMaxUser: 0,
    requestedMaxDataSize: 0,
    requestedModules: []
  },
  {
    id: "REQ-2025-004",
    user: {
      name: "Raj Kumar",
      email: "raj@techflow.in",
      company: "TechFlow Solutions"
    },
    type: "Upgrade" as const,
    quoteAmount: 15200,
    status: "Pending" as const,
    createdAt: "2025-01-12",
    requestedBilling: "Yearly",
    requestedMaxUser: 30,
    requestedMaxDataSize: 300,
    requestedModules: ["Maps", "AEC BIM", "Fiber Planner"]
  },
  {
    id: "REQ-2025-005",
    user: {
      name: "Lakshmi Nair",
      email: "lakshmi@urbandyn.com",
      company: "Urban Dynamics"
    },
    type: "New Account" as const,
    quoteAmount: 6200,
    status: "Cancelled by User" as const,
    createdAt: "2025-01-11",
    requestedBilling: "Monthly",
    requestedMaxUser: 10,
    requestedMaxDataSize: 100,
    requestedModules: ["Maps"]
  },
];

interface RequestsListProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function RequestsList({ navigate }: RequestsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");

  const filteredRequests = requestsData.filter(request => {
    const matchesSearch = 
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || request.type.toLowerCase().replace(" ", "") === typeFilter;
    const matchesStatus = statusFilter === "all" || request.status.toLowerCase().replace(" ", "") === statusFilter.replace("cancelled", "cancelled by user");
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "New Account": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Upgrade": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Cancel": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Subscription Requests</h1>
          <p className="text-muted-foreground mt-1">Manage and approve subscription requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <User className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by request ID, user, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="newaccount">New Account</SelectItem>
                <SelectItem value="upgrade">Upgrade</SelectItem>
                <SelectItem value="cancel">Cancel</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled by User</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-36">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Amount Filter */}
            <Select value={amountFilter} onValueChange={setAmountFilter}>
              <SelectTrigger className="w-36">
                <DollarSign className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Amounts</SelectItem>
                <SelectItem value="low">{"< ₹5,000"}</SelectItem>
                <SelectItem value="medium">{"₹5,000 - ₹15,000"}</SelectItem>
                <SelectItem value="high">{"> ₹15,000"}</SelectItem>
              </SelectContent>
            </Select>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {filteredRequests.length} of {requestsData.length} requests
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="w-32">Request ID</TableHead>
                  <TableHead>User & Company</TableHead>
                  <TableHead className="w-32">Type</TableHead>
                  <TableHead className="w-32 text-right">Quote Amount</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="w-32">Created At</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow 
                    key={request.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate("/admin/requests/detail", { id: request.id })}
                  >
                    <TableCell className="font-mono font-medium">
                      {request.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.user.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {request.user.company}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getTypeColor(request.type)} font-medium`}
                      >
                        {request.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(request.quoteAmount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {request.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => navigate("/admin/requests/detail", { id: request.id })}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {request.status === "Pending" && (
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
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 1-{filteredRequests.length} of {requestsData.length} requests
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
