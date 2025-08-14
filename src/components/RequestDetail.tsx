import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

// Mock request data
const getRequestData = (requestId: string) => ({
  id: requestId,
  user: {
    name: "Priya Shah",
    email: "priya@acme.com",
    company: "Acme Infra"
  },
  type: "New Account",
  status: "Pending",
  createdAt: "2025-01-15",
  requestedBilling: "Yearly",
  requestedMaxUser: 25,
  requestedMaxDataSize: 250,
  requestedModules: ["Maps", "Reporting"],
  quoteAmount: 11800,
  timeline: [
    { step: "Created", date: "2025-01-15", status: "completed" },
    { step: "Under Review", date: "2025-01-15", status: "current" },
    { step: "Quoted", date: "", status: "pending" },
    { step: "Sent", date: "", status: "pending" },
    { step: "Approved", date: "", status: "pending" },
  ]
});

interface RequestDetailProps {
  requestId: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function RequestDetail({ requestId, navigate }: RequestDetailProps) {
  const [request, setRequest] = useState(getRequestData(requestId));
  const [isEditing, setIsEditing] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    setRequest(prev => ({ ...prev, status: "Approved" }));
    setShowApproveModal(false);
    toast.success("Request approved successfully");
  };

  const handleReject = () => {
    setRequest(prev => ({ ...prev, status: "Rejected" }));
    setShowRejectModal(false);
    toast.success("Request rejected");
  };

  const handleGenerateQuotation = () => {
    setShowQuoteModal(false);
    toast.success("Quotation generated and ready for preview");
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const availableModules = ["Maps", "Aerial Lidar", "Rail Insights", "AEC BIM", "Fiber Planner", "Reporting"];

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
            <StatusBadge status={request.status as any} />
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
                    {request.type}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <StatusBadge status={request.status as any} />
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
                      setRequest(prev => ({ ...prev, requestedBilling: value }))
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
                      onChange={(e) => setRequest(prev => ({ 
                        ...prev, 
                        requestedMaxUser: parseInt(e.target.value) 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxData">Max Data Size (GB)</Label>
                    <Input
                      id="maxData"
                      type="number"
                      value={request.requestedMaxDataSize}
                      onChange={(e) => setRequest(prev => ({ 
                        ...prev, 
                        requestedMaxDataSize: parseInt(e.target.value) 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Quote Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={request.quoteAmount}
                      onChange={(e) => setRequest(prev => ({ 
                        ...prev, 
                        quoteAmount: parseInt(e.target.value) 
                      }))}
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
                  {request.requestedModules.map((module, index) => (
                    <Badge key={index} variant="secondary">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {request.status === "Pending" && (
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

        {/* Timeline Panel */}
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
                {request.timeline.map((step, index) => (
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
        </div>
      </div>
    </div>
  );
}
