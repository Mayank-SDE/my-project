import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  ArrowLeft,
  Upload,
  FileText,
  Receipt,
  Edit,
  Save,
  X,
  Calendar,
  Users,
  Database,
  Settings,
  Download,
  Eye,
} from "lucide-react";
import { Separator } from "./ui/separator";

// Sample account data
const accountData = {
  id: "1",
  name: "Acme Infra",
  ownerName: "Priya Shah", 
  ownerEmail: "priya@acme.com",
  createdAt: "2025-07-18",
  subscription: {
    type: "paid",
    billingCycle: "Yearly",
    startDate: "2025-07-20",
    expirationDate: "2026-07-20",
    status: "Active",
    maxUser: 25,
    maxDataSize: 250,
    reservedDataSize: 180,
  },
  billingAddress: {
    firstName: "Priya",
    lastName: "Shah",
    company: "Acme Infrastructure Pvt Ltd",
    address: "Tower A, Tech Park",
    city: "Bangalore",
    state: "Karnataka", 
    zip: "560066",
    country: "India",
    phone: "+91-9876543210",
  },
  modules: [
    { id: "maps", name: "Maps", active: true },
    { id: "aerial", name: "Aerial Lidar", active: true },
    { id: "rail", name: "Rail Insights", active: false },
    { id: "aec", name: "AEC BIM", active: false },
    { id: "fiber", name: "Fiber Planner", active: false },
  ],
};

const sampleRequests = [
  {
    id: "req_123",
    type: "CREATE_PAID_ACCOUNT" as const,
    status: "APPROVED" as const,
    createdAt: "2025-07-18",
    quotationNumber: "QTN-2025-000001",
  },
];

const sampleDocuments = [
  {
    number: "QTN-2025-000001",
    type: "Quotation" as const,
    status: "Sent" as const,
    total: "₹11,800",
    issuedAt: "2025-08-11",
  },
  {
    number: "INV-2025-000042",
    type: "Invoice" as const, 
    status: "Paid" as const,
    total: "₹11,800",
    issuedAt: "2025-08-11",
  },
];

const sampleInvoices = [
  {
    invoiceNumber: "INV-2025-000042",
    type: "Invoice" as const,
    status: "Paid" as const,
    total: "₹11,800",
    dueAt: "2025-08-25",
    receiptNumber: "RCT-2025-000042",
  },
];

const sampleAttachments = [
  {
    filename: "company-registration.pdf",
    type: "PDF",
    uploadedAt: "2025-07-18",
    attachedBy: "Priya Shah",
  },
  {
    filename: "tax-certificate.pdf", 
    type: "PDF",
    uploadedAt: "2025-07-20",
    attachedBy: "Admin User",
  },
];

interface AccountDetailProps {
  accountId: string;
  onBack: () => void;
}

export function AccountDetail({ accountId, onBack }: AccountDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingSubscription, setIsEditingSubscription] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedSubscription, setEditedSubscription] = useState(accountData.subscription);
  const [editedAddress, setEditedAddress] = useState(accountData.billingAddress);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{accountData.name}</h1>
            <StatusBadge status={accountData.subscription.status as any} />
          </div>
          <p className="text-muted-foreground">
            {accountData.ownerName} • {accountData.ownerEmail} • Created {accountData.createdAt}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Attachment
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Create Request
          </Button>
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Open Documents
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="billing">Billing Address</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Subscription */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Plan Type</Label>
                    <p className="font-medium">{accountData.subscription.type}</p>
                  </div>
                  <div>
                    <Label>Billing Cycle</Label>
                    <StatusBadge status={accountData.subscription.billingCycle as any} />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <p className="text-sm">{accountData.subscription.startDate}</p>
                  </div>
                  <div>
                    <Label>Expiration Date</Label>
                    <p className="text-sm">{accountData.subscription.expirationDate}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Max Users
                    </Label>
                    <p className="font-medium">{accountData.subscription.maxUser}</p>
                  </div>
                  <div>
                    <Label className="flex items-center gap-1">
                      <Database className="h-4 w-4" />
                      Max Data Size
                    </Label>
                    <p className="font-medium">{accountData.subscription.maxDataSize}GB</p>
                  </div>
                  <div>
                    <Label>Reserved Data</Label>
                    <p className="text-sm text-muted-foreground">
                      {accountData.subscription.reservedDataSize}GB used
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Documents</span>
                  <Badge variant="secondary">{sampleDocuments.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unpaid Invoices</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Payment</span>
                  <span className="text-sm text-muted-foreground">2025-08-11</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Modules</span>
                  <Badge variant="secondary">
                    {accountData.modules.filter(m => m.active).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Subscription Details
                {!isEditingSubscription ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingSubscription(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditingSubscription(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditingSubscription ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Max Users</Label>
                    <p className="font-medium">{accountData.subscription.maxUser}</p>
                  </div>
                  <div>
                    <Label>Max Data Size</Label>
                    <p className="font-medium">{accountData.subscription.maxDataSize}GB</p>
                  </div>
                  <div>
                    <Label>Billing Cycle</Label>
                    <StatusBadge status={accountData.subscription.billingCycle as any} />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <StatusBadge status={accountData.subscription.status as any} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxUser">Max Users</Label>
                    <Input 
                      id="maxUser"
                      type="number"
                      value={editedSubscription.maxUser}
                      onChange={(e) => setEditedSubscription({
                        ...editedSubscription,
                        maxUser: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxDataSize">Max Data Size (GB)</Label>
                    <Input
                      id="maxDataSize" 
                      type="number"
                      value={editedSubscription.maxDataSize}
                      onChange={(e) => setEditedSubscription({
                        ...editedSubscription,
                        maxDataSize: parseInt(e.target.value)
                      })}
                    />
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="flex gap-4">
                <Button variant="outline" className="text-amber-600 hover:bg-amber-50">
                  Suspend Account
                </Button>
                <Button variant="outline" className="text-destructive hover:bg-destructive/5">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>Modules Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enable or disable modules for this account
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accountData.modules.map((module) => (
                  <Card key={module.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{module.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {module.active ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <Switch checked={module.active} />
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button>Save Module Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleDocuments.map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{doc.number}</TableCell>
                      <TableCell>
                        <StatusBadge type={doc.type} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={doc.status} />
                      </TableCell>
                      <TableCell>{doc.total}</TableCell>
                      <TableCell>{doc.issuedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Attachments
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploaded At</TableHead>
                    <TableHead>Attached By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleAttachments.map((attachment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{attachment.filename}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{attachment.type}</Badge>
                      </TableCell>
                      <TableCell>{attachment.uploadedAt}</TableCell>
                      <TableCell>{attachment.attachedBy}</TableCell>
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

        {/* Other tabs would be implemented similarly */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <p className="font-medium">{accountData.billingAddress.company}</p>
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <p>{accountData.billingAddress.firstName} {accountData.billingAddress.lastName}</p>
                </div>
                <div>
                  <Label>Address</Label>
                  <p>{accountData.billingAddress.address}</p>
                </div>
                <div>
                  <Label>City</Label>
                  <p>{accountData.billingAddress.city}, {accountData.billingAddress.state}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p>{accountData.billingAddress.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
