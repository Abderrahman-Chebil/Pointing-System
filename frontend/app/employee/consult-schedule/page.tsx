"use client"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { EmployeeLayout } from "@/components/employee-layout"
import { Clock, User, Scan, Hand, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for multiple users
const users = [
  {
    id: 1,
    name: "John Doe",
    role: "Employee",
    avatar: "/path-to-avatar1.jpg",
    schedule: "08:30 - 17:00",
    pointings: [
      { time: "08:30", method: "QR Code" },
      { time: "12:15", method: "Manual" },
      { time: "17:00", method: "QR Code" }
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Manager",
    avatar: "/path-to-avatar2.jpg",
    schedule: "09:00 - 18:00",
    pointings: [
      { time: "09:05", method: "Visual Detection" },
      { time: "13:00", method: "QR Code" },
      { time: "18:00", method: "Manual" }
    ]
  },
  {
    id: 3,
    name: "Robert Johnson",
    role: "Employee",
    avatar: "/path-to-avatar3.jpg",
    schedule: "08:00 - 16:30",
    pointings: [
      { time: "08:00", method: "QR Code" },
      { time: "12:30", method: "Visual Detection" },
      { time: "16:30", method: "QR Code" }
    ]
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Employee",
    avatar: "/path-to-avatar4.jpg",
    schedule: "08:30 - 17:00",
    pointings: [
      { time: "08:35", method: "Manual" },
      { time: "17:00", method: "QR Code" }
    ]
  }
]

const getMethodIcon = (method: string) => {
  switch(method) {
    case "QR Code":
      return <Scan className="h-4 w-4" />;
    case "Manual":
      return <Hand className="h-4 w-4" />;
    case "Visual Detection":
      return <Eye className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
}

export default function TeamPointingsPage() {
  return (
    <EmployeeLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#cbf3f0] to-[#cbf3f0]/70 text-[#0A0908] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#3d5a80] mb-6">Team Pointings</h1>
          
          <Card className="border-none shadow-lg">
            <div className="bg-gradient-to-r from-[#3d5a80] to-[#3d5a80]/90 text-white p-4">
              <CardTitle className="text-xl">Today's Pointings</CardTitle>
            </div>
            <CardContent className="p-0 divide-y divide-[#0A0908]/10">
              {users.map((user) => (
                <div key={user.id} className="p-4 hover:bg-[#cbf3f0]/30 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* User Avatar and Info */}
                    <Avatar className="h-12 w-12 mt-1">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">{user.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-[#0A0908]/70">
                            <span className="capitalize">{user.role.toLowerCase()}</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-[#2ec4b6]" />
                              <span>{user.schedule}</span>
                            </div>
                            
                          </div>
                                
                      <div className="text-xs px-2 py-1 bg-[#3d5a80]/10 text-[#3d5a80] rounded-full w-fit ">
                          {user.pointings.length} pointings
                        </div>
                        </div>
                                {/* Pointings List */}
                      <div className="mt-3 space-y-2 w-[200px]">
                        {user.pointings.map((pointing, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <div className="flex items-center space-x-1 text-[#2ec4b6]">
                              {getMethodIcon(pointing.method)}
                              <span className="text-[#0A0908] font-medium">{pointing.time}</span>
                            </div>
                            <span className="text-[#0A0908]/70 capitalize">{pointing.method.toLowerCase()}</span>
                          </div>
                        ))}
                      </div>
                      
                      </div>
                
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  )
}