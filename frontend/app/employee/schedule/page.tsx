"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Upload, FileText, CalendarIcon, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { EmployeeLayout } from "@/components/employee-layout"
import { planningApi, justificationApi } from "@/lib/api"
import { showErrorToast, showSuccessToast } from "@/lib/toast"

interface ScheduleItem {
  id: number
  date: string
  start_time: string
  end_time: string
  activity: string
  location: string
  status: "completed" | "missed"
}

interface AbsenceRequest {
  id: number
  date: string
  session: string
  status: "justified" | "pending" | "rejected" | "not_justified"
  justification?: string
  approved?: boolean
  reviewed_by?: string
  document_url?: string
}

export default function EmployeeSchedulePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingFor, setUploadingFor] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("tomorrow")
  const [isLoading, setIsLoading] = useState(true)
  const [tomorrowSchedule, setTomorrowSchedule] = useState<ScheduleItem[]>([])
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>([])
  const [planningHistory, setPlanningHistory] = useState<ScheduleItem[]>([])

  // Fetch all schedule data
  const fetchScheduleData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      // Get tomorrow's date in YYYY-MM-DD format
  // In fetchScheduleData() function
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const tomorrowDate = tomorrow.toISOString().split('T')[0] // "YYYY-MM-DD"

const scheduleResponse = await planningApi.getMySchedule(
  { 
    start_date: tomorrowDate, 
    end_date: tomorrowDate ,
    
  },
  token
)
      setTomorrowSchedule(scheduleResponse.data as ScheduleItem[])

      // Fetch absence requests
      const absenceResponse = await justificationApi.getMyJustifications(token)
      setAbsenceRequests(absenceResponse.data as AbsenceRequest[])

      // Fetch planning history (last 30 days)
      const historyStartDate = new Date()
      historyStartDate.setDate(historyStartDate.getDate() - 30)
      const historyResponse = await planningApi.getMySchedule(
        { 
          start_date: historyStartDate.toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0],
          state: "all"
        },
        token
      )
      setPlanningHistory(historyResponse.data as ScheduleItem[])

    } catch (error) {
      showErrorToast({
        title: "Failed to load schedule data",
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchScheduleData()
  }, [activeTab]) // Refetch when tab changes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async (absenceId: number) => {
    if (!selectedFile || !uploadingFor) return

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      // Assuming you want to send a justification text and an optional file as 'picture'
      await justificationApi.createJustification(
        {
          text: "Justification for absence", // You may want to collect this from user input
          picture: selectedFile
        },
        token
      )
      
      showSuccessToast({
        title: "Justification uploaded",
        description: "Justification uploaded successfully"
      })
      fetchScheduleData() // Refresh data
    } catch (error) {
      showErrorToast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setSelectedFile(null)
      setUploadingFor(null)
    }
  }

  // Calculate absence statistics
  const totalAbsences = absenceRequests.length
  const justifiedAbsences = absenceRequests.filter(a => a.status === "justified").length
  const pendingAbsences = absenceRequests.filter(a => a.status === "pending").length
  const rejectedAbsences = absenceRequests.filter(a => a.status === "rejected").length
  const unjustifiedAbsences = absenceRequests.filter(a => a.status === "not_justified").length

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#3d5a80]" />
        </div>
      </EmployeeLayout>
    )
  }

  return (
    <EmployeeLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#cbf3f0] to-[#cbf3f0]/70 text-[#0A0908] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#3d5a80]">Employee Schedule</h1>
            <p className="text-[#0A0908]/70 mt-2">View and manage your work schedule and absences</p>
          </div>

          <Tabs defaultValue="tomorrow" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6 bg-[#3d5a80]/10">
              <TabsTrigger value="tomorrow" className="data-[state=active]:bg-[#3d5a80] data-[state=active]:text-white">
                Tomorrow
              </TabsTrigger>
              <TabsTrigger value="absence" className="data-[state=active]:bg-[#3d5a80] data-[state=active]:text-white">
                Absence Justification
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-[#3d5a80] data-[state=active]:text-white">
                History
              </TabsTrigger>
            </TabsList>

            {/* Tomorrow's Planning */}
            <TabsContent value="tomorrow" className="space-y-6">
              <Card className="border-none shadow-lg">
                <div className="bg-gradient-to-r from-[#3d5a80] to-[#3d5a80]/90 text-white p-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <CardTitle className="text-xl">Tomorrow's Schedule</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">
                    {new Date(Date.now() + 86400000).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </div>
                <CardContent className="p-0">
                  {tomorrowSchedule.length > 0 ? (
                    tomorrowSchedule.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border-b border-[#0A0908]/10 last:border-b-0 hover:bg-[#cbf3f0]/30 transition-colors"
                      >
                        <div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-[#2ec4b6]" />
                            <span className="font-medium">{item.start_time} - {item.end_time}</span>
                          </div>
                          <h3 className="font-semibold text-lg mt-1">{item.activity}</h3>
                          <div className="text-sm text-[#0A0908]/70 mt-1 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {item.location}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-[#0A0908]/50">
                      No schedule for tomorrow
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Absence Justification */}
            <TabsContent value="absence" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg lg:col-span-2">
                  <div className="bg-gradient-to-r from-[#3d5a80] to-[#3d5a80]/90 text-white p-4">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 mr-2" />
                      <CardTitle className="text-xl">Missed Sessions</CardTitle>
                    </div>
                    <CardDescription className="text-white/80">
                      Upload justifications for missed sessions and view their status
                    </CardDescription>
                  </div>
                  <CardContent className="p-0">
                    {absenceRequests.length > 0 ? (
                      absenceRequests.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 border-b border-[#0A0908]/10 last:border-b-0 hover:bg-[#cbf3f0]/30 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-[#2ec4b6]" />
                                <span className="font-medium">
                                  {new Date(item.date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                                <Badge
                                  className={`ml-3 ${
                                    item.status === "justified"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : item.status === "pending"
                                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                        : "bg-red-100 text-red-800 hover:bg-red-100"
                                  }`}
                                >
                                  {item.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="text-sm mt-1">{item.session}</div>
                              {item.justification && (
                                <div className="text-sm text-[#0A0908]/70 mt-1">
                                  <span className="font-medium">Justification:</span> {item.justification}
                                </div>
                              )}
                              {item.reviewed_by && (
                                <div className="text-sm text-[#0A0908]/70 mt-1">Reviewed by: {item.reviewed_by}</div>
                              )}
                            </div>
                            <div>
                              {item.status === "not_justified" && (
                                <Button
                                  size="sm"
                                  className="bg-[#2ec4b6] hover:bg-[#2ec4b6]/90"
                                  onClick={() => setUploadingFor(item.id)}
                                >
                                  <Upload className="h-4 w-4 mr-1" />
                                  Justify
                                </Button>
                              )}
                              {item.status === "pending" && (
                                <Badge className="bg-amber-100 text-amber-800">Awaiting Review</Badge>
                              )}
                              {item.status === "justified" && (
                                <Badge className="bg-green-100 text-green-800">Approved</Badge>
                              )}
                              {item.status === "rejected" && (
                                <Button
                                  size="sm"
                                  className="bg-[#3d5a80] hover:bg-[#3d5a80]/90"
                                  onClick={() => setUploadingFor(item.id)}
                                >
                                  Resubmit
                                </Button>
                              )}
                            </div>
                          </div>
                          {uploadingFor === item.id && (
                            <div className="mt-3 p-3 bg-[#cbf3f0]/30 rounded-md">
                              <div className="text-sm font-medium mb-2">Upload Justification Document</div>
                              <div className="flex items-center gap-2">
                                <Input type="file" className="flex-1" onChange={handleFileChange} />
                                <Button
                                  size="sm"
                                  className="bg-[#2ec4b6] hover:bg-[#2ec4b6]/90"
                                  onClick={() => handleUpload(item.id)}
                                  disabled={!selectedFile}
                                >
                                  Submit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[#3d5a80] text-[#3d5a80]"
                                  onClick={() => setUploadingFor(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-[#0A0908]/50">
                        No absence requests found
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <div className="bg-gradient-to-r from-[#2ec4b6] to-[#2ec4b6]/90 text-white p-4">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <CardTitle className="text-xl">Absence Summary</CardTitle>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-[#3d5a80]">{totalAbsences}</div>
                        <div className="text-sm text-[#0A0908]/70">total absences this year</div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Justified: {justifiedAbsences}</span>
                          <span>Unjustified: {unjustifiedAbsences + rejectedAbsences}</span>
                        </div>
                        <Progress value={(justifiedAbsences / totalAbsences) * 100} className="h-2 bg-red-100" />
                      </div>

                      <div className="pt-2 space-y-3">
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm">Justified</span>
                          </div>
                          <span className="text-sm font-medium">{justifiedAbsences}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-amber-50 rounded-md">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-sm">Pending Review</span>
                          </div>
                          <span className="text-sm font-medium">{pendingAbsences}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-50 rounded-md">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-sm">Rejected/Unjustified</span>
                          </div>
                          <span className="text-sm font-medium">{unjustifiedAbsences + rejectedAbsences}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Planning History */}
            <TabsContent value="history" className="space-y-6">
              <Card className="border-none shadow-lg">
                <div className="bg-gradient-to-r from-[#3d5a80] to-[#3d5a80]/90 text-white p-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    <CardTitle className="text-xl">Planning History</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">
                    View your past schedules and upload justifications if needed
                  </CardDescription>
                </div>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#3d5a80]/5">
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-right py-3 px-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {planningHistory.length > 0 ? (
                          planningHistory.map((item) => (
                            <tr key={item.id} className="border-b border-[#0A0908]/10 last:border-0 hover:bg-[#cbf3f0]/20">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-2 text-[#2ec4b6]" />
                                  {new Date(item.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${
                                    item.status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {item.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {item.status === "missed" && <XCircle className="h-3 w-3 mr-1" />}
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                {item.status === "missed" && (
                                  uploadingFor === item.id ? (
                                    <div className="flex items-center justify-end gap-2">
                                      <Input type="file" className="w-auto text-sm" onChange={handleFileChange} />
                                      <Button
                                        size="sm"
                                        className="bg-[#2ec4b6] hover:bg-[#2ec4b6]/90"
                                        onClick={() => handleUpload(item.id)}
                                        disabled={!selectedFile}
                                      >
                                        Upload
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-[#2ec4b6] text-[#2ec4b6] hover:bg-[#2ec4b6]/10"
                                      onClick={() => setUploadingFor(item.id)}
                                    >
                                      <Upload className="h-4 w-4 mr-1" />
                                      Justify
                                    </Button>
                                  )
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-8 text-center text-[#0A0908]/50">
                              No history found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#cbf3f0]/20 flex justify-between p-4">
                  <Button variant="outline" className="border-[#3d5a80] text-[#3d5a80] hover:bg-[#3d5a80]/10">
                    Previous
                  </Button>
                  <Button className="bg-[#3d5a80] hover:bg-[#3d5a80]/90">Next</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </EmployeeLayout>
  )
}