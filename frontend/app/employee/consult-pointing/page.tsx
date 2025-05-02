"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Loader2 } from "lucide-react"
import { EmployeeLayout } from "@/components/employee-layout"
import { pointingApi,profileApi } from "@/lib/api"
import { showErrorToast } from "@/lib/toast"

interface PointingRecord {
  id: number
  user: {
    id: number
    first_name: string
    last_name: string
    department: string
    picture: string

  }
  date: string // ISO format "YYYY-MM-DD"
  time: string // "HH:MM:SS"
  status: "present" | "absent" | "late" | "justified"
  method: "qr" | "face_recognition" | "manual"
}



export default function ConsultPage() {
  const [pointings, setPointings] = useState<PointingRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const today = new Date().toISOString().split('T')[0]

  const fetchPointings = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      // Get pointing data for the last 30 days
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const response = await pointingApi.getMyPointing(
        {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          method: "all"
        },
        token
      )
      
      setPointings(response.data as PointingRecord[])
    } catch (error) {
      showErrorToast({
        title: "Failed to load pointing data",
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPointings()
  }, [])

  const todayPointings = pointings.filter(p => p.date === today)
  const oldPointings = pointings.filter(p => p.date !== today)

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#3d5a80]" />
        </div>
      </EmployeeLayout>
    )
  }
  const pointingMethodToImage = {
    qr: "/QR.jpg",
    face_recognition: "/Face_reocognition.png",
    manual: "/hand.jpg"
  }


  const pointingMethodToTitle = {
    qr: "QR Code",
    face_recognition: "Face Recognition",
    manual: "Manual"
  }

  
  return (
    <EmployeeLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#e0fbfc] to-[#e0fbfc]/70 text-[#0A0908] p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#3d5a80]">Consult Pointing History</h1>
            <p className="text-[#0A0908]/70 mt-2">View attendance records for today and previous days</p>
          </div>

          <Tabs defaultValue="today" className="w-full">
            <TabsList className="bg-[#3d5a80]/10 mb-6">
              <TabsTrigger value="today">Today's Pointings</TabsTrigger>
              <TabsTrigger value="old">Old Pointings</TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              {todayPointings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {todayPointings.map((p) => {
                    const pointingDate = new Date(`${p.date}T${p.time}`)
                    return (
                      <Card key={p.id} className="border-none shadow-md">
                        <CardHeader className="flex items-center gap-4">
                          <Avatar>
                            {p.user.picture ? (
                              <AvatarImage 
                                src={pointingMethodToImage[p.method]} 
                                alt={`${p.user.first_name} ${p.user.last_name}`}
                              />
                            ) : null}
                            <AvatarFallback>
                              {`${p.user.first_name?.charAt(0) || ""}${p.user.last_name?.charAt(0) || ""}`}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{pointingMethodToTitle[p.method]}</CardTitle>
                            <p className="text-sm text-[#0A0908]/70">{p.user.department}</p>
                          </div>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                          <Badge 
                            variant="outline" 
                            className={
                              p.status === "present" ? "border-green-500 text-green-600" :
                              p.status === "late" ? "border-amber-500 text-amber-600" :
                              "border-red-500 text-red-600"
                            }
                          >
                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                          </Badge>
                          <div className="flex items-center text-sm text-[#0A0908]/70 gap-1">
                            <Clock className="w-4 h-4" />
                            {pointingDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-[#0A0908]/70 mt-10">
                  <CalendarDays className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No pointings for today</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="old">
              {oldPointings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {oldPointings.map((p) => {
                    const pointingDate = new Date(`${p.date}T${p.time}`)
                    return (
                      <Card key={p.id} className="border-none shadow-md">
                        <CardHeader className="flex items-center gap-4">
                        <Avatar>
                            {p.user.picture ? (
                              <AvatarImage 
                                src={pointingMethodToImage[p.method]} 
                                alt={`${p.user.first_name} ${p.user.last_name}`}
                              />
                            ) : null}
                            <AvatarFallback>
                              {`${p.user.first_name?.charAt(0) || ""}${p.user.last_name?.charAt(0) || ""}`}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{`${p.user.first_name} ${p.user.last_name}`}</CardTitle>
                            <p className="text-sm text-[#0A0908]/70">{p.user.department}</p>
                          </div>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                          <Badge 
                            variant="outline" 
                            className={
                              p.status === "present" ? "border-green-500 text-green-600" :
                              p.status === "late" ? "border-amber-500 text-amber-600" :
                              "border-red-500 text-red-600"
                            }
                          >
                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                          </Badge>
                          <div className="flex flex-col text-sm text-[#0A0908]/70 items-end">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {pointingDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {pointingDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-[#0A0908]/70 mt-10">
                  <CalendarDays className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No old pointings found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </EmployeeLayout>
  )
}