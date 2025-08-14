import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
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
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  UserPlus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Sample users data
const usersData = [
  {
    id: "usr_001",
    name: "Priya Shah",
    email: "priya@acme.com",
    role: "Client Admin",
    status: "Active",
    createdAt: "2025-01-15",
    lastLogin: "2025-01-15 14:30",
    company: "Acme Infra",
    accountsCount: 2
  },
  {
    id: "usr_002", 
    name: "Arjun Rao",
    email: "arjun@nimbus.io",
    role: "Client User",
    status: "Active",
    createdAt: "2025-01-14",
    lastLogin: "2025-01-14 16:45",
    company: "Nimbus Rail",
    accountsCount: 1
  },
  {
    id: "usr_003",
    name: "Meera Iyer",
    email: "meera@vertex.aec", 
    role: "Client Admin",
    status: "Inactive",
    createdAt: "2025-01-13",
    lastLogin: "2025-01-10 09:15",
    company: "Vertex AEC",
    accountsCount: 1
  },
  {
    id: "usr_004",
    name: "Raj Kumar",
    email: "raj@techflow.in",
    role: "Client User",
    status: "Active",
    createdAt: "2025-01-12",
    lastLogin: "2025-01-15 11:20",
    company: "TechFlow Solutions",
    accountsCount: 3
  },
  {
    id: "usr_005",
    name: "Admin User",
    email: "admin@s2m.com",
    role: "System Admin",
    status: "Active", 
    createdAt: "2024-12-01",
    lastLogin: "2025-01-15 18:45",
    company: "S2M Technologies",
    accountsCount: 0
  },
  {
    id: "usr_006",
    name: "Support Agent",
    email: "support@s2m.com",
    role: "Support",
    status: "Active",
    createdAt: "2024-12-15",
    lastLogin: "2025-01-15 12:30",
    company: "S2M Technologies", 
    accountsCount: 0
  },
];

interface UsersListProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function UsersList({ navigate }: UsersListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role.toLowerCase().replace(" ", "") === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "System Admin": return "bg-red-100 text-red-800 border-red-200";
      case "Support": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Client Admin": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Client User": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Inactive": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Suspended": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Users Management</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
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
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="systemadmin">System Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="clientadmin">Client Admin</SelectItem>
                <SelectItem value="clientuser">Client User</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
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

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {filteredUsers.length} of {usersData.length} users
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Accounts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate("/admin/users/detail", { id: user.id })}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/avatars/${user.id}.jpg`} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getRoleBadgeColor(user.role)} font-medium`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusBadgeColor(user.status)} font-medium`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.company}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-full">
                        {user.accountsCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.createdAt}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/admin/users/detail", { id: user.id });
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
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
          Showing 1-{filteredUsers.length} of {usersData.length} users
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
