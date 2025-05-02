"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { EmployeeLayout } from "@/components/employee-layout"
import { Calendar, Clock, Users, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"

type DayName = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday";
type EmployeeSchedules = {
  [employeeId: string]: {
    [day in DayName]: number[]
  }
};

const teamMembers = [
  { id: "emp-001", name: "John Doe", role: "Senior Consultant", avatar: "JD" },
  { id: "emp-002", name: "Jane Smith", role: "Junior Consultant", avatar: "JS" },
  { id: "emp-003", name: "Robert Johnson", role: "Consultant", avatar: "RJ" },
  { id: "emp-004", name: "Emily Davis", role: "Junior Consultant", avatar: "ED" },
]

const initialSchedules: EmployeeSchedules = {
  "emp-001": {
    sunday: [9, 10, 11],
    monday: [8, 9, 10, 14, 15],
    tuesday: [10, 11, 14, 15],
    wednesday: [14, 15, 16],
    thursday: [9, 10, 11],
  },
  "emp-002": {
    sunday: [],
    monday: [9, 10, 14, 15],
    tuesday: [8, 9],
    wednesday: [],
    thursday: [13, 14, 15, 16],
  },
  "emp-003": {
    sunday: [8, 9, 10],
    monday: [],
    tuesday: [],
    wednesday: [8, 9, 10, 11],
    thursday: [],
  },
  "emp-004": {
    sunday: [],
    monday: [13, 14, 15],
    tuesday: [9, 10, 11],
    wednesday: [],
    thursday: [8, 9, 10],
  },
}

const days: DayName[] = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
const dayDisplayNames = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday"
};

export default function ManagerConsultationPlanningPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(teamMembers[0].id)
  const [schedules, setSchedules] = useState<EmployeeSchedules>(initialSchedules)
  const [isEditing, setIsEditing] = useState(false)

  const currentEmployee = teamMembers.find(emp => emp.id === selectedEmployee)
  const currentSchedule = schedules[selectedEmployee] || {}

  const timeSlots = Array.from({ length: 10 }, (_, i) => i + 8) // 8:00 to 17:00

  const toggleHour = (day: DayName, hour: number) => {
    if (!isEditing) return
    
    setSchedules(prev => {
      const currentHours = [...(prev[selectedEmployee]?.[day] || [])]
      const index = currentHours.indexOf(hour)
      
      if (index >= 0) {
        // Remove hour
        currentHours.splice(index, 1)
      } else {
        // Add hour
        currentHours.push(hour)
        currentHours.sort((a, b) => a - b)
      }

      return {
        ...prev,
        [selectedEmployee]: {
          ...prev[selectedEmployee],
          [day]: currentHours
        }
      }
    })
  }

  const isWorkingHour = (day: DayName, hour: number) => {
    return currentSchedule[day]?.includes(hour) || false
  }

  return (
    <EmployeeLayout>
      <div className="min-h-screen text-[#0A0908] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#3d5a80]">Team Consultation Planning</h1>
              <p className="text-[#0A0908]/70 mt-2">View and manage your team members' schedules</p>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "destructive" : "default"}
            >
              {isEditing ? "Finish Editing" : "Edit Schedule"}
            </Button>
          </div>

          {/* User Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#3d5a80] mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Select Team Member
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedEmployee(member.id)}
                  className={`p-4 rounded-lg transition-all border-2 ${selectedEmployee === member.id 
                    ? "border-[#3d5a80] bg-white shadow-md" 
                    : "border-transparent bg-white/70 hover:bg-white hover:border-[#3d5a80]/30"}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-[#3d5a80] flex items-center justify-center text-white font-medium">
                        {member.avatar}
                      </div>
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Employee Info */}
          {currentEmployee && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#3d5a80]">
                {currentEmployee.name}'s Weekly Schedule
              </h2>
            </div>
          )}

          {/* Weekly Schedule */}
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#3d5a80] to-[#3d5a80]/90 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <h2 className="text-xl font-semibold">Weekly Schedule</h2>
                </div>
                {isEditing && (
                  <div className="text-sm text-white/80">
                    Click on time slots to add/remove working hours
                  </div>
                )}
              </div>
            </div>
            <CardContent className="p-0">
              <div className="grid" style={{ gridTemplateRows: `repeat(${days.length + 1}, minmax(0, 1fr)` }}>
                {/* Header Row - Hours */}
                <div className="grid grid-cols-11 sticky top-0 z-10 bg-[#3d5a80]/5">
                  <div className="p-4 font-medium text-center border-b border-[#0A0908]/10">Day</div>
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="p-4 font-medium text-center border-b border-[#0A0908]/10"
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>

                {/* Rows for each day */}
                {days.map((day) => (
                  <div key={day} className="grid grid-cols-11 border-t border-[#0A0908]/10">
                    {/* Day Name */}
                    <div className="p-4 text-center border-r border-[#0A0908]/10 font-medium sticky left-0 bg-white z-10">
                      {dayDisplayNames[day]}
                    </div>

                    {/* Time Slots */}
                    {timeSlots.map((hour) => {
                      const working = isWorkingHour(day, hour)
                      return (
                        <div
                          key={`${day}-${hour}`}
                          onClick={() => toggleHour(day, hour)}
                          className={`p-4 text-center border-r border-[#0A0908]/10 last:border-r-0 relative h-16 
                            ${isEditing ? "cursor-pointer hover:bg-[#3d5a80]/10" : ""}`}
                        >
                          {working ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={`${isEditing ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-r from-[#2ec4b6] to-[#2ec4b6]/90"} text-white py-2 px-3 shadow-md w-full`}>
                                <div className="flex items-center justify-center">
                                  {isEditing ? (
                                    <Minus className="h-4 w-4" />
                                  ) : (
                                    <Clock className="h-4 w-4 mr-1" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : isEditing ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 shadow-md w-full opacity-0 hover:opacity-100 transition-opacity">
                                <Plus className="h-4 w-4 mx-auto" />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
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