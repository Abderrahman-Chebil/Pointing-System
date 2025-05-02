"use client"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { EmployeeLayout } from "@/components/employee-layout"
import { Clock, Scan, Hand, Eye, Check, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react";

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
    ],
    status: "pending" // Added status field
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
    ],
    status: "pending"
  },
  // ... more users
]

const getMethodIcon = (method: string) => {
  switch(method) {
    case "QR Code": return <Scan className="h-3 w-3" />;
    case "Manual": return <Hand className="h-3 w-3" />;
    case "Visual Detection": return <Eye className="h-3 w-3" />;
    default: return null;
  }
}

export default function TeamPointingsPage() {
  const [userStatus, setUserStatus] = useState<Record<number, string>>(
    users.reduce((acc, user) => ({ ...acc, [user.id]: user.status }), {})
  );

  const handleAccept = (userId: number) => {
    setUserStatus(prev => ({ ...prev, [userId]: "accepted" }));
  };

  const handleRefuse = (userId: number) => {
    setUserStatus(prev => ({ ...prev, [userId]: "refused" }));
  };

  return (
    <EmployeeLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#cbf3f0] to-[#cbf3f0]/70 text-[#0A0908] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#3d5a80] mb-6">Pointings</h1>
          
          <Card className="border-none shadow-lg">
            <div className="bg-gradient-to-r from-[#3d5a80] to-[#3d5a80]/90 text-white p-4">
              <CardTitle className="text-xl">Today's Pointings</CardTitle>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-[#0A0908]/10">
                {users.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-[#cbf3f0]/30 transition-colors">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* User Avatar */}
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      {/* User Info - Horizontal Layout */}
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <h3 className="font-bold whitespace-nowrap">{user.name}</h3>
                          <span className="text-sm text-[#0A0908]/70 capitalize whitespace-nowrap">
                            {user.role.toLowerCase()}
                          </span>
                          <div className="flex items-center text-sm text-[#0A0908]/70 whitespace-nowrap">
                            <Clock className="h-3 w-3 mr-1 text-[#2ec4b6]" />
                            <span>{user.schedule}</span>
                          </div>
                        </div>
                        
                        {/* Pointings - Horizontal Layout */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                          {user.pointings.map((pointing, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <span className="font-medium mr-1">{pointing.time}</span>
                              <span className="text-[#0A0908]/70 flex items-center gap-1">
                                {getMethodIcon(pointing.method)}
                                <span className="capitalize">{pointing.method.toLowerCase()}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Pointings Count */}
                      <div className="text-xs px-2 py-1 bg-[#3d5a80]/10 text-[#3d5a80] rounded-full whitespace-nowrap">
                        {user.pointings.length} pointings
                      </div>

                      {/* Accept/Refuse Buttons */}
                      <div className="flex items-center gap-2 ml-auto">
                        {userStatus[user.id] === "accepted" ? (
                          <span className="text-green-600 text-sm font-medium">Accepted</span>
                        ) : userStatus[user.id] === "refused" ? (
                          <span className="text-red-600 text-sm font-medium">Refused</span>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() => handleAccept(user.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500 text-red-600 hover:bg-red-50"
                              onClick={() => handleRefuse(user.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Refuse
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  )
}

