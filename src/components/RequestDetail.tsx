import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { StatusBadge } from "./StatusBadge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  Send, 
  CheckCircle, 
  XCircle,
  Calendar,
  User,
  Building2,
  
} from "lucide-react";
import { toast } from "sonner";
import { requestsService } from "../services/requestsService";
import { invoicesService } from "../services/invoicesService";
import { auditLogService } from "../services/auditLogService";
import { AuditLogPanel } from "./AuditLogPanel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import type { SubscriptionRequest, AuditLogEntry } from "../types/domain";
import { RequestStatusUI } from "../types/domain";

interface TimelineStep { step: string; date?: string; status: 'completed' | 'current' | 'pending'; }

interface RequestDetailProps {
  requestId: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function RequestDetail({ requestId, navigate }: RequestDetailProps) {
  const [request, setRequest] = useState<SubscriptionRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [audit, setAudit] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedInvoices, setRelatedInvoices] = useState<any[]>([]);

  useEffect(()=>{
    let unsubReq: (()=>void)|undefined;
    const load = async () => {
  setLoading(true);
  const r = await requestsService.get(requestId);
  setRequest(r||null);
  if(r){ const invs = await invoicesService.list(); setRelatedInvoices(invs.data.filter(i=>i.requestId===r.id)); }
  const logs = await auditLogService.list({ entityId: requestId });
  setAudit(logs.data);
      setLoading(false);
      unsubReq = requestsService.onChange(async ()=>{
        const updated = await requestsService.get(requestId); setRequest(updated||null);
        if(updated){ const invs2 = await invoicesService.list(); setRelatedInvoices(invs2.data.filter(i=>i.requestId===updated.id)); }
        const logs2 = await auditLogService.list({ entityId: requestId }); setAudit(logs2.data);
      });
    };
    load();
    return ()=>{ if(unsubReq) unsubReq(); };
  },[requestId]);

  const handleApprove = async () => {
    if(!request) return; await requestsService.setStatus(request.id, RequestStatusUI.APPROVED); setShowApproveModal(false); toast.success("Request approved successfully"); };

  const handleReject = async () => { if(!request) return; await requestsService.setStatus(request.id, RequestStatusUI.REJECTED); setShowRejectModal(false); toast.success("Request rejected"); };

  const handleGenerateQuotation = async () => { if(!request) return; setShowQuoteModal(false); await invoicesService.createDraftQuotation({ requestId: request.id, accountId: '1', amount: request.quoteAmount || 0, currency: 'INR', lineItems: [{ description: request.type.replace('_',' '), quantity: 1, unitAmount: request.quoteAmount||0 }] }); toast.success("Quotation created (draft)"); };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  // const availableModules = ["Maps", "Aerial Lidar", "Rail Insights", "AEC BIM", "Fiber Planner", "Reporting"]; // future use for editing modules

  if(loading) return <div className="p-6">Loading...</div>;
  if(!request) return <div className="p-6">Request not found</div>;

  const timeline: TimelineStep[] = [
    { step: 'Created', date: request.createdAt, status: 'completed' },
    { step: 'Quoted', date: audit.find(a=>a.action==='QUOTATION_DRAFT_CREATED')?.timestamp?.slice(0,10), status: request.status===RequestStatusUI.QUOTED||request.status===RequestStatusUI.SENT||request.status===RequestStatusUI.APPROVED?'completed':'pending' },
    { step: 'Sent', date: audit.find(a=>a.action==='QUOTATION_SENT')?.timestamp?.slice(0,10), status: request.status===RequestStatusUI.SENT||request.status===RequestStatusUI.APPROVED?'completed':'pending' },
    { step: 'Approved', date: request.status===RequestStatusUI.APPROVED? new Date().toISOString().slice(0,10): undefined, status: request.status===RequestStatusUI.APPROVED?'current':'pending' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/requests")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">{request.id}</h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-muted-foreground mt-1">{request.type} Request • Created {request.createdAt}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Save Changes" : "Edit Request"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Request Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Requester</Label>
                  <p className="font-medium">{request.user.name}</p>
                  <p className="text-sm text-muted-foreground">{request.user.email}</p>
                </div>
                <div>
                  <Label>Company</Label>
                  <p className="font-medium">{request.user.company}</p>
                </div>
                <div>
                  <Label>Request Type</Label>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {request.type.replace('_',' ')}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <StatusBadge status={request.status} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requested Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Requested Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billing">Billing Cycle</Label>
                    <Select value={request.requestedBilling} onValueChange={(value) => 
                      setRequest(prev => prev ? { ...prev, requestedBilling: value as any } : prev)
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxUser">Max Users</Label>
                    <Input
                      id="maxUser"
                      type="number"
                      value={request.requestedMaxUser}
                      onChange={(e) => setRequest(prev => prev ? { ...prev, requestedMaxUser: parseInt(e.target.value) } : prev)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxData">Max Data Size (GB)</Label>
                    <Input
                      id="maxData"
                      type="number"
                      value={request.requestedMaxDataSize}
                      onChange={(e) => setRequest(prev => prev ? { ...prev, requestedMaxDataSize: parseInt(e.target.value) } : prev)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Quote Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={request.quoteAmount}
                      onChange={(e) => setRequest(prev => prev ? { ...prev, quoteAmount: parseInt(e.target.value) } : prev)}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Billing Cycle</Label>
                    <p className="font-medium">{request.requestedBilling}</p>
                  </div>
                  <div>
                    <Label>Max Users</Label>
                    <p className="font-medium">{request.requestedMaxUser}</p>
                  </div>
                  <div>
                    <Label>Max Data Size</Label>
                    <p className="font-medium">{request.requestedMaxDataSize} GB</p>
                  </div>
                  <div>
                    <Label>Quote Amount</Label>
                    <p className="font-medium">{formatCurrency(request.quoteAmount)}</p>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <Label>Requested Modules</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(request.requestedModules||[]).map((module, index) => (
                    <Badge key={index} variant="secondary">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {request.status === RequestStatusUI.PENDING && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Quotation
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate Quotation</DialogTitle>
                        <DialogDescription>
                          This will create a PDF quotation for the requested configuration.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="font-medium">Quotation Preview</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            PDF will be generated with current configuration and pricing.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowQuoteModal(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleGenerateQuotation}>
                          Generate & Preview
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Send Quotation Email
                  </Button>

                  <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
                    <DialogTrigger asChild>
                      <Button>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve Request</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to approve this {request.type.toLowerCase()} request?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowApproveModal(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleApprove}>
                          Approve Request
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-destructive hover:bg-destructive/5">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Request</DialogTitle>
                        <DialogDescription>
                          Please provide a reason for rejecting this request.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="reason">Rejection Reason</Label>
                        <Textarea
                          id="reason"
                          placeholder="Enter reason for rejection..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleReject}
                          disabled={!rejectReason.trim()}
                        >
                          Reject Request
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Panels */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Request Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      step.status === "completed" ? "bg-green-500" :
                      step.status === "current" ? "bg-blue-500" : "bg-gray-300"
                    }`} />
                    <div className="flex-1">
                      <p className={`font-medium ${
                        step.status === "current" ? "text-blue-600" : ""
                      }`}>
                        {step.step}
                      </p>
                      {step.date && (
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Related Invoices / Quotations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-64">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-36">Number</TableHead>
                      <TableHead className="w-24">Kind</TableHead>
                      <TableHead className="w-24">Status</TableHead>
                      <TableHead className="text-right w-32">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedInvoices.map(inv => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{inv.kind}</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{inv.status}</Badge></TableCell>
                        <TableCell className="text-right text-xs">₹{inv.amount.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                    {relatedInvoices.length===0 && <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground text-xs">No related invoices yet</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <AuditLogPanel entityId={request.id} />
        </div>
      </div>
    </div>
  );
}
