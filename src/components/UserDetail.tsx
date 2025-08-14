import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
  Edit, 
  Save,
  Pause,
  Building2,
  Calendar,
  User,
  Activity,
  Shield
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

// Mock user data
const getUserData = (userId: string) => ({
  id: userId,
  name: "Priya Shah",
  email: "priya@acme.com",
  role: "Client Admin",
  status: "Active",
  createdAt: "2025-01-15",
  lastLogin: "2025-01-15 14:30",
  company: "Acme Infra",
  phone: "+91-9876543210",
  accounts: [
    {
      id: "acc_001",
      name: "Acme Infrastructure Main",
      type: "paid",
      billingCycle: "Yearly",
      startDate: "2025-01-15",
      endDate: "2026-01-15",
      status: "Active",
    },
    {
      id: "acc_002", 
      name: "Acme Infrastructure Trial",
      type: "trial",
      billingCycle: "Monthly",
      startDate: "2025-01-10",
      endDate: "2025-02-10",
      status: "Active",
    }
  ],
  recentActivity: [
    {
      action: "Account Created",
      details: "Created new account 'Acme Infrastructure Main'",
      timestamp: "2025-01-15 14:30",
      type: "account"
    },
    {
      action: "Login",
      details: "Successful login from 49.37.xx.xx",
      timestamp: "2025-01-15 14:25",
      type: "auth"
    },
    {
      action: "Profile Updated",
      details: "Updated phone number",
      timestamp: "2025-01-14 16:20",
      type: "profile"
    },
    {
      action: "Request Submitted",
      details: "Submitted upgrade request REQ-2025-001",
      timestamp: "2025-01-14 10:15",
      type: "request"
    }
  ]
});

interface UserDetailProps {
  userId: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function UserDetail({ userId, navigate }: UserDetailProps) {
  const [user, setUser] = useState(getUserData(userId));
  const [isEditing, setIsEditing] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleSuspendAccount = (accountId: string) => {
    setUser(prev => ({
      ...prev,
      accounts: prev.accounts.map(account => 
        account.id === accountId 
          ? { ...account, status: "Suspended" }
          : account
      )
    }));
    setShowSuspendModal(false);
    toast.success("Account suspended successfully");
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "paid": return "bg-green-100 text-green-800 border-green-200";
      case "trial": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "account": return "🏢";
      case "auth": return "🔐";
      case "profile": return "👤";
      case "request": return "📝";
      default: return "📄";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-12 w-12">
          <AvatarImage src={`/avatars/${userId}.jpg`} alt={user.name} />
          <AvatarFallback className="text-lg">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">{user.name}</h1>
            <Badge 
              variant="outline" 
              className="bg-purple-100 text-purple-800 border-purple-200"
            >
              {user.role}
            </Badge>
            <Badge 
              variant="outline" 
              className="bg-green-100 text-green-800 border-green-200"
            >
              {user.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{user.email} • {user.company}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Save Changes" : "Edit User"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Accounts & Subscriptions
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity & Requests
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={user.phone}
                        onChange={(e) => setUser(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label>Full Name</Label>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Role</Label>
                  <Badge 
                    variant="outline" 
                    className="bg-purple-100 text-purple-800 border-purple-200 ml-2"
                  >
                    {user.role}
                  </Badge>
                </div>
                <div>
                  <Label>Company</Label>
                  <p className="font-medium">{user.company}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge 
                    variant="outline" 
                    className="bg-green-100 text-green-800 border-green-200 ml-2"
                  >
                    {user.status}
                  </Badge>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm text-muted-foreground">{user.createdAt}</p>
                </div>
                <div>
                  <Label>Last Login</Label>
                  <p className="text-sm text-muted-foreground">{user.lastLogin}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>User Accounts & Subscriptions</CardTitle>
              <p className="text-sm text-muted-foreground">
                All accounts and subscriptions associated with this user
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Billing Cycle</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getAccountTypeColor(account.type)} font-medium`}
                        >
                          {account.type === "paid" ? "Paid" : "Trial"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={account.billingCycle as any} />
                      </TableCell>
                      <TableCell className="text-sm">{account.startDate}</TableCell>
                      <TableCell className="text-sm">{account.endDate}</TableCell>
                      <TableCell>
                        <StatusBadge status={account.status as any} />
                      </TableCell>
                      <TableCell className="text-right">
                        {account.status === "Active" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Pause className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Suspend Account</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to suspend the account "{account.name}"? 
                                  This will immediately disable access for the user.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleSuspendAccount(account.id)}
                                >
                                  Suspend Account
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                User actions and system events
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="text-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.action}</p>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
