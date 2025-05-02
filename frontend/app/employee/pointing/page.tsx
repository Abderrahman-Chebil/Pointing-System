"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Camera, QrCode, Check, X, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { EmployeeLayout } from "@/components/employee-layout"

// Mock data for employees
const mockEmployees = [
  {
    id: "emp1",
    name: "John Smith",
    department: "Computer Science",
    status: "Present",
    lastPointing: "Today, 08:45 AM",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp2",
    name: "Sarah Johnson",
    department: "Mathematics",
    status: "Absent",
    lastPointing: "Yesterday, 09:15 AM",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp3",
    name: "Michael Brown",
    department: "Administration",
    status: "Present",
    lastPointing: "Today, 08:30 AM",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp4",
    name: "Emily Davis",
    department: "Biology",
    status: "Not Pointed",
    lastPointing: "2 days ago, 08:50 AM",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp5",
    name: "Robert Wilson",
    department: "Physics",
    status: "Present",
    lastPointing: "Today, 09:05 AM",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp6",
    name: "Jennifer Lee",
    department: "Student Affairs",
    status: "Late",
    lastPointing: "Today, 10:20 AM",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp7",
    name: "David Miller",
    department: "Chemistry",
    status: "Not Pointed",
    lastPointing: "3 days ago, 08:45 AM",
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function PointingPage() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedEmployee, setScannedEmployee] = useState<(typeof mockEmployees)[0] | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) => {
    return (
        
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play() // <-- ADD THIS LINE
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }
  

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }

  // Capture image from camera
  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)

        // Simulate finding an employee by image
        simulateFindEmployeeByImage()
      }
    }
  }

  // Simulate QR code scanning
  const startQrScanning = () => {
    setIsScanning(true)

    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)

      // Randomly select an employee to simulate successful scan
      const randomEmployee = mockEmployees[Math.floor(Math.random() * mockEmployees.length)]
      setScannedEmployee(randomEmployee)

      toast({
        title: "QR Code Scanned",
        description: `Employee identified: ${randomEmployee.name}`,
      })
    }, 2000)
  }

  // Simulate finding employee by image
  const simulateFindEmployeeByImage = () => {
    // Randomly select an employee to simulate image recognition
    setTimeout(() => {
      const randomEmployee = mockEmployees[Math.floor(Math.random() * mockEmployees.length)]
      setScannedEmployee(randomEmployee)

      toast({
        title: "Employee Identified",
        description: `Identified ${randomEmployee.name} from image`,
      })
    }, 1500)
  }

  // Handle manual pointing
  const handlePoint = (employeeId: string) => {
    setEmployees(
      employees.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            status: "Present",
            lastPointing: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          }
        }
        return emp
      }),
    )

    toast({
      title: "Employee Pointed",
      description: `Successfully recorded attendance for ${employees.find((e) => e.id === employeeId)?.name}`,
    })
  }

  // Handle pointing for scanned employee
  const handlePointScannedEmployee = () => {
    if (scannedEmployee) {
      handlePoint(scannedEmployee.id)
      setScannedEmployee(null)
      setCapturedImage(null)
    }
  }

  // Clean up camera on component unmount
  useEffect(() => {
    startCamera(); // Start the camera when the component mounts

    return () => {
      stopCamera(); // Stop the camera when the component unmounts
    };
  }, [])

  return (
     <EmployeeLayout>
    <div className="min-h-screen bg-gradient-to-br from-[#cbf3f0] to-[#cbf3f0]/70 text-[#0A0908] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3d5a80]">Employee Pointing System</h1>
          <p className="text-[#0A0908]/70 mt-2">Record employee attendance via QR code, camera, or manual selection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Scan QR Code / Take Picture */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg overflow-hidden">
              <CardHeader className="bg-[#3d5a80] text-white pb-4">
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Scan QR Code / Take Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={startQrScanning}
                      className="bg-[#3d5a80] hover:bg-[#3d5a80]/90"
                      disabled={isScanning}
                    >
                      {isScanning ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <QrCode className="mr-2 h-4 w-4" />
                          Scan QR Code
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={takePicture}
                      className="bg-[#2ec4b6] hover:bg-[#2ec4b6]/90"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Take Picture
                    </Button>
                  </div>

                  {/* Camera View */}
                  <div className="relative rounded-lg overflow-hidden bg-black/10 aspect-video flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {/* Hidden canvas for capturing images */}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* Captured Image */}
                  {capturedImage && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Captured Image:</h3>
                      <div className="rounded-lg overflow-hidden border border-[#3d5a80]/20">
                        <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full" />
                      </div>
                    </div>
                  )}

                  {/* Scanned Employee */}
                  {scannedEmployee && (
                    <div className="mt-6 p-4 bg-[#3d5a80]/10 rounded-lg">
                      <h3 className="font-medium mb-3">Identified Employee:</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={scannedEmployee.image || "/placeholder.svg"} />
                            <AvatarFallback>
                              {scannedEmployee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{scannedEmployee.name}</div>
                            <div className="text-sm text-[#0A0908]/70">{scannedEmployee.department}</div>
                          </div>
                        </div>
                        <Button onClick={handlePointScannedEmployee} className="bg-green-600 hover:bg-green-700">
                          <Check className="mr-2 h-4 w-4" />
                          Confirm & Point
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Manual Pointing */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-[#3d5a80] text-white pb-4">
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Manual Pointing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A0908]/50" />
                    <Input
                      placeholder="Search employees..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="rounded-md border">
                    <div className="divide-y">
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <div
                            key={employee.id}
                            className="p-4 flex items-center justify-between hover:bg-[#cbf3f0]/30"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={employee.image || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {employee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-sm text-[#0A0908]/70">{employee.department}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    className={
                                      employee.status === "Present"
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : employee.status === "Absent"
                                          ? "bg-red-100 text-red-800 hover:bg-red-100"
                                          : employee.status === "Late"
                                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                    }
                                  >
                                    {employee.status}
                                  </Badge>
                                  <span className="text-xs text-[#0A0908]/50">{employee.lastPointing}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => handlePoint(employee.id)}
                              className={
                                employee.status === "Present"
                                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                  : "bg-[#2ec4b6] hover:bg-[#2ec4b6]/90"
                              }
                              disabled={employee.status === "Present"}
                            >
                              {employee.status === "Present" ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  Pointed
                                </>
                              ) : (
                                "Point"
                              )}
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-[#0A0908]/70">
                          <p>No employees found matching your search criteria</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Statistics */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-[#2ec4b6] text-white pb-4">
                <CardTitle>Today's Pointing Statistics</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {employees.filter((e) => e.status === "Present").length}
                    </div>
                    <div className="text-sm text-[#0A0908]/70">Present</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {employees.filter((e) => e.status === "Absent").length}
                    </div>
                    <div className="text-sm text-[#0A0908]/70">Absent</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      {employees.filter((e) => e.status === "Late").length}
                    </div>
                    <div className="text-sm text-[#0A0908]/70">Late</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {employees.filter((e) => e.status === "Not Pointed").length}
                    </div>
                    <div className="text-sm text-[#0A0908]/70">Not Pointed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
     </EmployeeLayout>
  )
}
