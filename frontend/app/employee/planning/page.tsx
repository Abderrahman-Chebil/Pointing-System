"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { EmployeeLayout } from "@/components/employee-layout"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Clock, Loader2 } from 'lucide-react'
import { planningApi } from "@/lib/api"
import { showErrorToast } from "@/lib/toast"

interface PlanningEntry {
  id: string
  day: string // Format: "YYYY-MM-DD"
  start_time: string // Format: "HH:MM:SS"
  end_time: string // Format: "HH:MM:SS"
  user: string
  is_active: boolean
}

export default function ConsultationPlanningPage() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [planningData, setPlanningData] = useState<PlanningEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch planning data from backend
  const fetchPlanningData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      const response = await planningApi.getMyPlanning(token)
      setPlanningData(response.data as PlanningEntry[])
    } catch (error) {
      showErrorToast({
        title: "Failed to load planning",
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlanningData()
  }, [currentWeek])

  // Convert planning data to working hours format
  const getWorkingHours = () => {
    const hoursMap: Record<string, number[]> = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: []
    }

    planningData.forEach(entry => {
      if (!entry.is_active) return // Skip inactive entries
      
      const startHour = parseInt(entry.start_time.split(':')[0])
      const endHour = parseInt(entry.end_time.split(':')[0])
      
      // Add all hours in the time slot
      for (let hour = startHour; hour < endHour; hour++) {
        hoursMap[entry.day].push(hour)
      }
    })

    return hoursMap
  }

  const workingHours = getWorkingHours()
  const timeSlots = Array.from({ length: 10 }, (_, i) => i + 8) // 8:00 to 17:00
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]

  const isWorkingHour = (day: string, hour: number) => {
    const dayKey = day.toLowerCase() as keyof typeof workingHours
    return workingHours[dayKey].includes(hour)
  }

 const getDayDisplayName = (day: string) => {
    const dayNames: Record<string, string> = {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday"
    }
    return dayNames[day] || day
  }
  // Get the current week's dates
  const getCurrentWeekDates = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diff = 0 - dayOfWeek // Adjust to get Sunday
    
    const sunday = new Date(today)
    sunday.setDate(today.getDate() + diff + (currentWeek * 7))
    
    const weekDates = []
    for (let i = 0; i < 5; i++) {
      const date = new Date(sunday)
      date.setDate(sunday.getDate() + i)
      weekDates.push(date)
    }
    
    return weekDates
  }

  const weekDates = getCurrentWeekDates()

  const nextWeek = () => setCurrentWeek(currentWeek + 1)
  const prevWeek = () => setCurrentWeek(currentWeek - 1)

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
      <div className="min-h-screen text-[#0A0908] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#3d5a80]">My Consultation Planning</h1>
              <p className="text-[#0A0908]/70 mt-2">
                View and manage your weekly consultation schedule
              </p>
            </div>
            
          </div>

          {/* Desktop View - Modern Timeline */}
          <Card className="border-none shadow-xl overflow-hidden mb-8 hidden md:block">
            <div className="bg-gradient-to-r from-[#3d5a80] to-[#3d5a80]/90 text-white p-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <h2 className="text-xl font-semibold">Weekly Schedule Timeline</h2>
              </div>
            </div>
            <CardContent className="p-0">
            <div className="grid grid-rows-6 bg-[#3d5a80]/5">
        {/* Header Row - Hours */}
        <div className="grid grid-cols-11">
          <div className="p-4 font-medium text-center border-b border-[#0A0908]/10">Day</div>
          {timeSlots.map((hour) => (
            <div key={hour} className="p-4 font-medium text-center border-b border-[#0A0908]/10">
              {hour}:00
            </div>
          ))}
        </div>

        {/* Rows for Days */}
        {days.map((day) => (
          <div key={day} className="grid grid-cols-11 border-t border-[#0A0908]/10">
            {/* Day Name */}
            <div className="p-4 text-center border-r border-[#0A0908]/10 font-medium">
              {getDayDisplayName(day)}
            </div>

            {/* Time Slots */}
            {timeSlots.map((hour) => (
              <div
                key={`${day}-${hour}`}
                className={`p-4 text-center border-r border-[#0A0908]/10 last:border-r-0 relative`}
              >
                {isWorkingHour(day, hour) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-[#2ec4b6] to-[#2ec4b6]/90 text-white py-2 px-3 shadow-md w-full transform transition-transform hover:scale-105 cursor-pointer">
                      <div className="flex items-center justify-center">
                        <Clock className="h-4 w-4 mr-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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