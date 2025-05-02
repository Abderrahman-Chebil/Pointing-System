"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Server, Database, HardDrive, Cpu, Network, Lock, Mail, FileText, Download, Clock } from 'lucide-react'

// Mock system components and their status
const initialSystemComponents = [
  {
    id: "database",
    name: "Database Connection",
    status: "healthy",
    description: "Connection to the main database",
    lastChecked: new Date().toISOString(),
    responseTime: "45ms",
    icon: Database,
  },
  {
    id: "api",
    name: "API Services",
    status: "healthy",
    description: "REST API endpoints",
    lastChecked: new Date().toISOString(),
    responseTime: "120ms",
    icon: Server,
  },
  {
    id: "storage",
    name: "File Storage",
    status: "warning",
    description: "Document and media storage",
    lastChecked: new Date().toISOString(),
    responseTime: "200ms",
    warning: "80% capacity used",
    icon: HardDrive,
  },
  {
    id: "auth",
    name: "Authentication Service",
    status: "healthy",
    description: "User authentication and authorization",
    lastChecked: new Date().toISOString(),
    responseTime: "65ms",
    icon: Lock,
  },
  {
    id: "email",
    name: "Email Service",
    status: "error",
    description: "Notification emails",
    lastChecked: new Date().toISOString(),
    responseTime: "500ms",
    error: "SMTP connection timeout",
    icon: Mail,
  },
  {
    id: "scheduler",
    name: "Appointment Scheduler",
    status: "healthy",
    description: "Scheduling and calendar system",
    lastChecked: new Date().toISOString(),
    responseTime: "85ms",
    icon: Clock,
  },
  {
    id: "qrcode",
    name: "QR Code Generator",
    status: "healthy",
    description: "QR code generation for appointments",
    lastChecked: new Date().toISOString(),
    responseTime: "30ms",
    icon: FileText,
  },
  {
    id: "ai",
    name: "Visual Scan Service",
    status: "warning",
    description: "AI-powered visual scanning",
    lastChecked: new Date().toISOString(),
    responseTime: "350ms",
    warning: "High latency detected",
    icon: Cpu,
  },
  {
    id: "network",
    name: "Network Connectivity",
    status: "healthy",
    description: "Internal network status",
    lastChecked: new Date().toISOString(),
    responseTime: "15ms",
    icon: Network,
  },
]

export default function SystemCheckPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [systemComponents, setSystemComponents] = useState(initialSystemComponents)
  const [sanityScore, setSanityScore] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  // Calculate sanity score based on component status
  const calculateSanityScore = (components: typeof systemComponents) => {
    const total = components.length
    const healthy = components.filter(c => c.status === "healthy").length
    const warning = components.filter(c => c.status === "warning").length
    
    // Healthy components count fully, warnings count as half
    return Math.round(((healthy + warning * 0.5) / total) * 100)
  }

  // Filter components based on active tab
  const filteredComponents = systemComponents.filter(component => {
    if (activeTab === "all") return true
    if (activeTab === "issues") return component.status !== "healthy"
    return component.status === activeTab
  })

  // Run system check
  const runSystemCheck = () => {
    setIsChecking(true)
    setSanityScore(0)
    
    // Simulate checking process with progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setSanityScore(Math.min(progress, 100))
      
      if (progress >= 100) {
        clearInterval(interval)
        completeCheck()
      }
    }, 100)
  }

  // Complete the check with randomized results
  const completeCheck = () => {
    // Simulate updated component statuses
    const updatedComponents = systemComponents.map(component => {
      // Randomly change some statuses for demo purposes
      const rand = Math.random()
      let status = component.status
      
      if (rand < 0.1) {
        status = "error"
      } else if (rand < 0.2) {
        status = "warning"
      } else {
        status = "healthy"
      }
      
      return {
        ...component,
        status,
        lastChecked: new Date().toISOString(),
        responseTime: `${Math.floor(Math.random() * 400 + 20)}ms`,
      }
    })
    
    setSystemComponents(updatedComponents)
    setLastChecked(new Date())
    setIsChecking(false)
  }

  // Update sanity score when components change
  useEffect(() => {
    if (!isChecking) {
      setSanityScore(calculateSanityScore(systemComponents))
    }
  }, [systemComponents, isChecking])

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Warning</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3d5a80]">System Health Check</h1>
            <p className="text-[#0A0908]/70 mt-2">
              Monitor and diagnose the university appointment system
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-[#2ec4b6] hover:bg-[#2ec4b6]/90" 
              onClick={runSystemCheck}
              disabled={isChecking}
            >
              {isChecking ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run System Check
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-lg md:col-span-2">
            <CardHeader className="bg-[#3d5a80] text-white pb-4">
              <CardTitle>System Sanity Score</CardTitle>
              <CardDescription className="text-white/80">
                Overall health of the university appointment system
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl font-bold text-[#3d5a80]">{sanityScore}%</div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-[#cbf3f0]"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-[#2ec4b6]"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${sanityScore * 2.51} 251`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    {sanityScore >= 90 ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        <span className="font-medium">System is healthy</span>
                      </div>
                    ) : sanityScore >= 70 ? (
                      <div className="flex items-center text-amber-600">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        <span className="font-medium">System needs attention</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="mr-2 h-5 w-5" />
                        <span className="font-medium">System has critical issues</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {systemComponents.filter(c => c.status === "healthy").length}
                    </div>
                    <div className="text-sm text-[#0A0908]/70">Healthy</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">
                      {systemComponents.filter(c => c.status === "warning").length}
                    </div>
                    <div className="text-sm text-[#0A0908]/70">Warnings</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {systemComponents.filter(c => c.status === "error").length}
                    </div>
                    <div className="text-sm text-[#0A0908]/70">Errors</div>
                  </div>
                </div>

                {lastChecked && (
                  <div className="text-center text-sm text-[#0A0908]/70">
                    Last checked: {lastChecked.toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="bg-[#2ec4b6] text-white pb-4">
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription className="text-white/80">
                System performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-[#0A0908]/70 mb-1">Average Response Time</div>
                  <div className="text-2xl font-bold text-[#3d5a80]">
                    {Math.round(
                      systemComponents.reduce(
                        (acc, comp) => acc + parseInt(comp.responseTime.replace("ms", "")), 
                        0
                      ) / systemComponents.length
                    )}ms
                  </div>
                  <Progress 
                    value={70} 
                    className="h-2 mt-2" 
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium text-[#0A0908]/70 mb-1">System Uptime</div>
                  <div className="text-2xl font-bold text-[#3d5a80]">99.8%</div>
                  <Progress 
                    value={99.8} 
                    className="h-2 mt-2" 
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium text-[#0A0908]/70 mb-1">Storage Usage</div>
                  <div className="text-2xl font-bold text-[#3d5a80]">80%</div>
                  <Progress 
                    value={80} 
                    className="h-2 mt-2" 
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium text-[#0A0908]/70 mb-1">Active Users</div>
                  <div className="text-2xl font-bold text-[#3d5a80]">245</div>
                  <Progress 
                    value={60} 
                    className="h-2 mt-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg mb-8">
          <CardHeader className="bg-[#3d5a80] text-white pb-4">
            <CardTitle>System Components</CardTitle>
            <CardDescription className="text-white/80">
              Detailed status of all system components
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="p-6" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#3d5a80] data-[state=active]:text-white">
                  All Components
                </TabsTrigger>
                <TabsTrigger value="healthy" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                  Healthy
                </TabsTrigger>
                <TabsTrigger value="warning" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                  Warnings
                </TabsTrigger>
                <TabsTrigger value="error" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Errors
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <div className="space-y-4">
                  {filteredComponents.length > 0 ? (
                    filteredComponents.map((component) => (
                      <div key={component.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              <component.icon className="h-5 w-5 text-[#3d5a80]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{component.name}</h3>
                                {getStatusBadge(component.status)}
                              </div>
                              <p className="text-sm text-[#0A0908]/70 mt-1">{component.description}</p>
                              
                              {component.status === "warning" && component.warning && (
                                <div className="flex items-center mt-2 text-sm text-amber-600">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {component.warning}
                                </div>
                              )}
                              
                              {component.status === "error" && component.error && (
                                <div className="flex items-center mt-2 text-sm text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  {component.error}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{component.responseTime}</div>
                            <div className="text-xs text-[#0A0908]/50 mt-1">
                              Last checked: {formatDate(component.lastChecked)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#0A0908]/70">
                      No components match the selected filter
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between bg-[#cbf3f0]/20 py-4">
            <div className="text-sm text-[#0A0908]/70">
              Showing {filteredComponents.length} of {systemComponents.length} components
            </div>
            <Button variant="outline" size="sm" className="border-[#3d5a80] text-[#3d5a80]">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  )
}
