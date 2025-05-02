"use client"
import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, UserPlus, Filter, MoreHorizontal, UserX, UserCheck, RefreshCw, Download, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { userManagementApi, teamManagementApi } from "@/lib/api"
import { showErrorToast, showSuccessToast } from "@/lib/toast"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: 'employee' 
  team?: string
  is_active: boolean
  last_login?: string
  date_joined: string
  phone?: string
  job?: string
  is_manager: boolean
  is_chief: boolean
}

interface Team {
  id: string
  name: string
  description?: string
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTeamsLoading, setIsTeamsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    team: "",
    phone: "",
    job: "",
    confirmPassword: "",
    is_manager: false,
    is_chief: false,
    is_active: true
  })

  // Fetch users from backend
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      const response = await userManagementApi.manageUser.getAll(token)
      setUsers(response.data as User[])
    } catch (error) {
      showErrorToast({
        title: "Failed to load users",
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch teams from backend
  const fetchTeams = async () => {
    setIsTeamsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      const response = await teamManagementApi.manageTeam.getAll(token)
      setTeams(response.data as Team[])
    } catch (error) {
      showErrorToast({
        title: "Failed to load teams",
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsTeamsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchTeams()
  }, [])

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.team && user.team.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.job && user.job.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRole ? user.role === selectedRole : true;
    const matchesStatus = selectedStatus
      ? (selectedStatus === "active" && user.is_active) ||
        (selectedStatus === "inactive" && !user.is_active)
      : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // Prepare user data
      const userData = {
        username: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        team: newUser.team,
        phone: newUser.phone,
        job: newUser.job,
        is_active: newUser.is_active,
        is_manager: newUser.is_manager, // Use is_manager directly
        is_chief: newUser.is_chief,     // Use is_chief directly
      };

      const response = await userManagementApi.manageUser.create(userData, token);
      setUsers([...users, response.data as User]);
      setIsCreateUserOpen(false);
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        team: "",
        phone: "",
        job: "",
        confirmPassword: "",
        is_manager: false,
        is_chief: false,
        is_active: true,
      });
      showSuccessToast({ title: "User created successfully" });
    } catch (error) {
      showErrorToast({
        title: "Failed to create user",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
  
      await userManagementApi.manageUser.delete({ id: String(userToDelete) }, token);
      setUsers(users.filter((user) => user.id !== userToDelete));
      setUserToDelete(null);
      setIsDeleteDialogOpen(false);
      showSuccessToast({ title: "User deleted successfully" });
    } catch (error) {
      showErrorToast({
        title: "Failed to delete user",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
  
      const user = users.find((u) => u.id === userId);
      if (!user) return;
  
      const newStatus = !user.is_active;
  
      if (newStatus) {
        // User will be activated → call unfreeze
        console.log("Unfreezing user with ID:", userId);
        await userManagementApi.freezeUser.unfreeze({ id: String(userId) }, token);
      } else {
        // User will be frozen → call freeze
        console.log("Freezing user with ID:", userId);
        await userManagementApi.freezeUser.freeze({ id: String(userId) }, token);
      }
  
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, is_active: newStatus } : u
        )
      );
  
      showSuccessToast({
        title: `User ${newStatus ? "activated" : "frozen"}`,
      });
    } catch (error) {
      showErrorToast({
        title: "Failed to update user status",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setNewUser({
      ...newUser,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewUser({
      ...newUser,
      [name]: value,
    })
  }

  const handleRoleCheckboxChange = (role: 'manager' | 'chief') => {
    if (role === 'chief') {
      setNewUser({
        ...newUser,
        is_chief: !newUser.is_chief,
        is_manager: false // Chief can't also be manager
      });
    } else {
      setNewUser({
        ...newUser,
        is_manager: !newUser.is_manager,
        is_chief: false // Manager can't also be chief
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getRoleDisplayName = (user: User) => {
    if (user.is_chief) return "Chief";
    if (user.is_manager) return "Manager";
    return "Employee"; // Default role
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#3d5a80]" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3d5a80]">Manage Users</h1>
            <p className="text-[#0A0908]/70 mt-2">Create, edit, and manage user accounts</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-[#2ec4b6] hover:bg-[#2ec4b6]/90" 
              onClick={() => setIsCreateUserOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-lg mb-8">
          <CardHeader className="bg-[#3d5a80] text-white pb-4">
            <CardTitle>User Management</CardTitle>
            <CardDescription className="text-white/80">
              Manage all users in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A0908]/50" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select onValueChange={(value) => setSelectedRole(value === "all" ? null : value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="chief">Chief</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#3d5a80]/5">
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={`user-${user.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {`${user.first_name?.charAt(0) || ""}${user.last_name?.charAt(0) || ""}`}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{`${user.first_name} ${user.last_name}`}</div>
                              <div className="text-sm text-[#0A0908]/70">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleDisplayName(user)}</TableCell>                        
                        <TableCell>{user.team || '-'}</TableCell>
                        <TableCell>{user.job || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.is_active
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.last_login || '')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id)}>
                                {user.is_active ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    <span>Freeze User</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    <span>Activate User</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setUserToDelete(user.id)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete User</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-[#0A0908]/70">
                        No users found matching your search criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-[#cbf3f0]/20 py-4">
            <div className="text-sm text-[#0A0908]/70">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={newUser.first_name}
                  onChange={handleInputChange}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={newUser.last_name}
                  onChange={handleInputChange}
                  placeholder="Smith"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="john.smith@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select
                  value={newUser.team}
                  onValueChange={(value) => handleSelectChange("team", value)}
                  disabled={isTeamsLoading}
                >
                  <SelectTrigger id="team">
                    <SelectValue placeholder={isTeamsLoading ? "Loading teams..." : "Select team"} />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job">Job Title</Label>
                <Input
                  id="job"
                  name="job"
                  value={newUser.job}
                  onChange={handleInputChange}
                  placeholder="Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            
            {/* Role Selection Checkboxes */}
            <div className="space-y-3 pt-2">
              <Label>Role</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_manager" 
                    checked={newUser.is_manager}
                    onCheckedChange={() => handleRoleCheckboxChange('manager')}
                  />
                  <Label htmlFor="is_manager">Manager</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_chief" 
                    checked={newUser.is_chief}
                    onCheckedChange={() => handleRoleCheckboxChange('chief')}
                  />
                  <Label htmlFor="is_chief">Chief</Label>
                </div>
              </div>
              {newUser.is_manager || newUser.is_chief ? null : (
                <p className="text-sm text-muted-foreground">Default role is Employee</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="is_active"
                checked={newUser.is_active}
                onCheckedChange={(checked) =>
                  setNewUser({ ...newUser, is_active: checked })
                }
              />
              <Label htmlFor="is_active">Active Account</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#2ec4b6] hover:bg-[#2ec4b6]/90" 
              onClick={handleCreateUser}
              disabled={
                !newUser.first_name ||
                !newUser.last_name ||
                !newUser.email
              }
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-[#0A0908]/70">
              The user account will be permanently removed from the system, and all associated data will be deleted.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}