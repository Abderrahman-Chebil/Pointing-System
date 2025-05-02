"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Brain, BookOpen, Activity, TrendingUp, Heart, ChevronRight, Sparkles, ArrowUpRight, CheckCircle, User, Bell, Pill, Stethoscope, BarChart3, CalendarDays, Clipboard, PlusCircle, AlertCircle, ArrowRight, LayoutDashboard, Zap, ShieldCheck } from 'lucide-react'
import Link from "next/link"
import { EmployeeLayout } from "@/components/employee-layout"
import { showErrorToast } from "@/lib/toast"
import { getPatientAppointments, getMedicalRecords, type Appointment, type MedicalRecord } from "@/utils/api"
import { useAuth } from "@/utils/auth-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PatientDashboard() {
  const { isPremium } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null)
  const [recentResults, setRecentResults] = useState<MedicalRecord[]>([])
  const [healthScore, setHealthScore] = useState(85) // Mock health score

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      try {
        // Fetch appointments
        const appointments = await getPatientAppointments()

        // Find the closest accepted appointment (state "A")
        const acceptedAppointments = appointments.filter((app) => app.state === "A")
        if (acceptedAppointments.length > 0) {
          // Sort by appointment date (ascending)
          acceptedAppointments.sort(
            (a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime(),
          )
          setUpcomingAppointment(acceptedAppointments[0])
        }

        // Fetch medical records
        const records = await getMedicalRecords()

        // Sort by creation date (descending) and take the last two
        records.sort((a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime())
        setRecentResults(records.slice(0, 2))
      } catch (error) {
        showErrorToast({
          title: "Failed to load dashboard data",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <EmployeeLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-teal-900">My Health Dashboard</h1>
              <p className="text-teal-700 mt-2 max-w-2xl">
                Track your health journey, manage appointments, and access your medical records in one place
              </p>
            </div>
            {isPremium ? (
              <Badge className="bg-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Premium Member
              </Badge>
            ) : (
              <Button
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-sm"
                size="lg"
                asChild
              >
                <Link href="/patient/premium" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Upgrade to Premium
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-teal-100 rounded-full p-3">
                  <CalendarDays className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Next Appointment</p>
                  <p className="text-2xl font-bold">
                    {upcomingAppointment
                      ? new Date(upcomingAppointment.appointment_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "None"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <Clipboard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Recent Tests</p>
                  <p className="text-2xl font-bold">{recentResults.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-emerald-100 rounded-full p-3">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Health Score</p>
                  <p className="text-2xl font-bold">{healthScore}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Health Overview Card */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Health Overview
                  </CardTitle>
               
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Health Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-700">Health Score</h3>
                      <span className="text-lg font-bold text-teal-600">{healthScore}%</span>
                    </div>
                    <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                        style={{ width: `${healthScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Your health score is calculated based on your recent test results and health metrics
                    </p>
                  </div>

                  <Separator />

                  {/* Health Metrics */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">Key Health Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">Blood Pressure</span>
                        </div>
                        <p className="text-xl font-bold">120/80</p>
                        <p className="text-xs text-gray-500">Normal range</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">Heart Rate</span>
                        </div>
                        <p className="text-xl font-bold">72 bpm</p>
                        <p className="text-xs text-gray-500">Normal range</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                          <span className="text-sm font-medium">Cholesterol</span>
                        </div>
                        <p className="text-xl font-bold">190 mg/dL</p>
                        <p className="text-xs text-gray-500">Slightly elevated</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">Blood Sugar</span>
                        </div>
                        <p className="text-xl font-bold">95 mg/dL</p>
                        <p className="text-xs text-gray-500">Normal range</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">Recommendations</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full p-1.5 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Annual checkup complete</p>
                          <p className="text-sm text-gray-500">Your next annual checkup is due in 10 months</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 rounded-full p-1.5 mt-0.5">
                          <Bell className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Blood test recommended</p>
                          <p className="text-sm text-gray-500">Schedule a blood test in the next 3 months</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                          <Pill className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Vitamin D supplementation</p>
                          <p className="text-sm text-gray-500">Consider taking vitamin D supplements</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    Recent Test Results
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-teal-600" asChild>
                    <Link href="/patient/medical-folder" className="flex items-center gap-1">
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin"></div>
                  </div>
                ) : recentResults.length > 0 ? (
                  <div className="divide-y">
                    {recentResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between py-4 hover:bg-gray-50 rounded-lg transition-colors px-2"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-teal-100 rounded-full p-2">
                            <Clipboard className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{result.type}</div>
                            <p className="text-sm text-gray-500">{formatDate(result.creation_date)}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-teal-200 text-teal-700 hover:bg-teal-50"
                          asChild
                        >
                          <Link href={`/patient/medical-folder`}>View Details</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Recent Results</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      You don't have any recent test results. Your results will appear here after your next appointment.
                    </p>
                    <Button asChild>
                      <Link href="/patient/appointments">Schedule a Test</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Appointment Card */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6">
                <CardTitle className="text-xl font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin"></div>
                  </div>
                ) : upcomingAppointment ? (
                  <div className="space-y-6">
                    <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                      <div className="text-xl font-bold text-cyan-800 mb-2">{upcomingAppointment.type}</div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-cyan-600" />
                          <span className="text-gray-700">{formatDate(upcomingAppointment.appointment_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-cyan-600" />
                          <span className="text-gray-700">{formatTime(upcomingAppointment.appointment_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm font-medium text-green-700">Confirmed</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-700" asChild>
                        <Link href="/patient/appointments">Manage Appointment</Link>
                      </Button>
                      <Button variant="outline" className="w-full border-cyan-200 text-cyan-700 hover:bg-cyan-50">
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Upcoming Appointments</h3>
                    <p className="text-gray-500 mb-6">
                      You don't have any upcoming appointments scheduled. Book your next appointment now.
                    </p>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700" asChild>
                      <Link href="/patient/appointments" className="flex items-center justify-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Book Appointment
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Insights Card */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6">
                <CardTitle className="text-xl font-medium flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Health Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Get personalized AI-powered insights based on your test results and health data.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-800">Trend Analysis</span>
                      </div>
                      <p className="text-sm text-gray-600">Track your health metrics over time</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-800">Risk Assessment</span>
                      </div>
                      <p className="text-sm text-gray-600">Identify potential health risks</p>
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                    <Link href="/patient/ai-analysis" className="flex items-center justify-center gap-2">
                      <Zap className="h-4 w-4" />
                      Run AI Analysis
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Premium Features Card */}
            {!isPremium && (
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
                  <CardTitle className="text-xl font-medium flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Premium Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <p className="text-gray-600">
                      Upgrade to premium for advanced features and personalized health insights.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 rounded-full p-2">
                          <Brain className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Advanced AI Analysis</div>
                          <p className="text-sm text-gray-500">Get detailed health insights</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 rounded-full p-2">
                          <FileText className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Historical Data Tracking</div>
                          <p className="text-sm text-gray-500">Track your health over time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 rounded-full p-2">
                          <Calendar className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Priority Booking</div>
                          <p className="text-sm text-gray-500">Get priority access to appointments</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white" asChild>
                      <Link href="/patient/premium" className="flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Upgrade to Premium
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Health Tips Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            Health Tips & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="h-40 bg-teal-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=160&width=400')] bg-cover bg-center opacity-30"></div>
                <div className="absolute top-4 left-4 bg-white/90 rounded-full p-3">
                  <Activity className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                  Stay Active Daily
                </h3>
                <p className="text-gray-600 mb-4">
                  Aim for 30 minutes of moderate exercise daily to improve cardiovascular health and boost energy levels.
                </p>
                <Button variant="link" className="text-teal-600 hover:text-teal-800 p-0 h-auto" asChild>
                  <Link href="https://www.drworkout.fitness/benefits-of-30-minutes-of-exercise-a-day/?utm_source=chatgpt.com "target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="h-40 bg-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=160&width=400')] bg-cover bg-center opacity-30"></div>
                <div className="absolute top-4 left-4 bg-white/90 rounded-full p-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  Mental Wellness
                </h3>
                <p className="text-gray-600 mb-4">
                  Practice mindfulness for 10 minutes each day to reduce stress and improve mental clarity.
                </p>
                <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0 h-auto" asChild>
                  <Link href="https://www.vitiramentalhealth.com/post/boost-your-wellbeing-and-fight-depression-with-just-10-minutes-of-daily-mindfulness?utm_source=chatgpt.com "target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="h-40 bg-emerald-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=160&width=400')] bg-cover bg-center opacity-30"></div>
                <div className="absolute top-4 left-4 bg-white/90 rounded-full p-3">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  Track Your Progress
                </h3>
                <p className="text-gray-600 mb-4">
                  Monitor your health metrics regularly to identify trends and make informed decisions about your health.
                </p>
                <Button variant="link" className="text-emerald-600 hover:text-emerald-800 p-0 h-auto" asChild>
                  <Link href="https://medikeeper.com/blog/reasons-tracking-your-health-metrics/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  )
}
