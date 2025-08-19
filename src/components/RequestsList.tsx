import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Download, Eye, User, MoreHorizontal, FileText } from "lucide-react";
import { Badge } from "./ui/badge";
import { FilterBar } from "./FilterBar";

import { requestsService } from "../services/requestsService";
import type { SubscriptionRequest } from "../types/domain";
import { RequestStatusUI, RequestTypeUI } from "../types/domain";
import { authService } from "../services/authService";

interface RequestsListProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function RequestsList({ navigate }: RequestsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [requestsData, setRequestsData] = useState<SubscriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { permissions } = authService.getCurrent();

  useEffect(()=>{
    let unsub: (()=>void)|undefined;
    const load = async () => {
      setLoading(true);
      const res = await requestsService.list();
      setRequestsData(res.data);
      setLoading(false);
      unsub = requestsService.onChange(async ()=>{
        const r = await requestsService.list();
        setRequestsData(r.data);
      });
    };
    load();
    return () => { if(unsub) unsub(); };
  },[]);

  const filteredRequests = requestsData.filter(request => {
    const matchesSearch = 
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
  (request.user.company || '').toLowerCase().includes(searchQuery.toLowerCase());
    
  const matchesType = typeFilter === "all" || request.type.toLowerCase() === typeFilter;
  const matchesStatus = statusFilter === "all" || request.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
  case RequestTypeUI.NEW_ACCOUNT: return "bg-blue-100 text-blue-800 border-blue-200";
  case RequestTypeUI.UPGRADE: return "bg-purple-100 text-purple-800 border-purple-200";
  case RequestTypeUI.CANCEL: return "bg-red-100 text-red-800 border-red-200";
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

      <Card>
        <CardContent className="p-4">
          <FilterBar
            search={{ value: searchQuery, onChange: setSearchQuery, placeholder: 'Search by request ID, user, or company...' }}
            selects={[
              { config: { key: 'type', placeholder: 'Type', options: [
                { value:'all', label:'All Types' },
                { value:'newaccount', label:'New Account' },
                { value:'upgrade', label:'Upgrade' },
                { value:'cancel', label:'Cancel' } ] }, value: typeFilter, onChange: setTypeFilter },
              { config: { key: 'status', placeholder: 'Status', options: [
                { value:'all', label:'All Status' },
                { value:'pending', label:'Pending' },
                { value:'approved', label:'Approved' },
                { value:'rejected', label:'Rejected' },
                { value:'cancelled', label:'Cancelled by User' } ] }, value: statusFilter, onChange: setStatusFilter },
              { config: { key: 'date', placeholder: 'Date Range', options: [
                { value:'all', label:'All Time' },
                { value:'today', label:'Today' },
                { value:'week', label:'This Week' },
                { value:'month', label:'This Month' } ], width: 'w-36' }, value: dateFilter, onChange: setDateFilter },
              { config: { key: 'amount', placeholder: 'Amount', options: [
                { value:'all', label:'All Amounts' },
                { value:'low', label:'< ₹5,000' },
                { value:'medium', label:'₹5,000 - ₹15,000' },
                { value:'high', label:'> ₹15,000' } ], width: 'w-40' }, value: amountFilter, onChange: setAmountFilter }
            ]}
            resultsInfo={loading ? 'Loading...' : `${filteredRequests.length} of ${requestsData.length} requests`}
          />
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
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Loading requests...</TableCell>
                  </TableRow>
                )}
                {!loading && filteredRequests.map((request) => (
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
                      <Badge variant="outline" className={`${getTypeColor(request.type)} font-medium`}>
                        {request.type.replace('_',' ')}
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
                          {request.status === RequestStatusUI.PENDING && permissions.includes('requests:quote') && (
                            <>
                              <InvoiceModal
                                type="QUOTATION"
                                subscriptionRequestId={request.id}
                                // For now map to first account or fallback; in real app request would link to account
                                accountId={request.userId ? '1' : '1'}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Quotation
                                  </DropdownMenuItem>
                                }
                              />
                {permissions.includes('requests:approve') && <DropdownMenuItem onClick={()=>requestsService.setStatus(request.id, RequestStatusUI.APPROVED)}>Approve</DropdownMenuItem>}
                {permissions.includes('requests:reject') && <DropdownMenuItem onClick={()=>requestsService.setStatus(request.id, RequestStatusUI.REJECTED)} className="text-destructive">Reject</DropdownMenuItem>}
                            </>
                          )}
              {request.status === RequestStatusUI.QUOTED && permissions.includes('invoices:send') && (
                            <DropdownMenuItem onClick={()=>requestsService.setStatus(request.id, RequestStatusUI.SENT)}>Send Quotation</DropdownMenuItem>
                          )}
              {request.status === RequestStatusUI.SENT && permissions.includes('requests:approve') && (
                            <DropdownMenuItem onClick={()=>requestsService.setStatus(request.id, RequestStatusUI.APPROVED)}>Mark Approved</DropdownMenuItem>
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
