"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { EmployeeLayout } from "@/components/employee-layout"
import { Calendar, Clock, Users } from 'lucide-react'

// Mock data for team members
const teamMembers = [
  { id: "emp-001", name: "John Doe", role: "Senior Consultant", avatar: "JD" },
  { id: "emp-002", name: "Jane Smith", role: "Junior Consultant", avatar: "JS" },
  { id: "emp-003", name: "Robert Johnson", role: "Consultant", avatar: "RJ" },
  { id: "emp-004", name: "Emily Davis", role: "Junior Consultant", avatar: "ED" },
]

// Mock data for schedules (organized by employee)
type DayName = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday";
type EmployeeSchedules = {
  [employeeId: string]: {
    [day in DayName]: number[]
  }
};

const employeeSchedules: EmployeeSchedules = {
  "emp-001": {
    sunday: [9, 10, 11],
    monday: [],
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

export default function ManagerConsultationPlanningPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(teamMembers[0].id)

  // Get tomorrow's day name (e.g. "Monday")
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

  // Get current employee data
  const currentEmployee = teamMembers.find(emp => emp.id === selectedEmployee)
  const currentSchedule = employeeSchedules[selectedEmployee as keyof typeof employeeSchedules] || {}
  const tomorrowHours = currentSchedule[tomorrowDayName as keyof typeof currentSchedule] || []

  const timeSlots = Array.from({ length: 10 }, (_, i) => i + 8) // 8:00 to 17:00

  const isWorkingHour = (hour: number) => {
    return tomorrowHours.includes(hour)
  }

  const isConsecutiveWorkingHour = (hour: number) => {
    return isWorkingHour(hour) && isWorkingHour(hour + 1)
  }

  return (
    <EmployeeLayout>
      <div className="min-h-screen text-[#0A0908] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#3d5a80]">Team Consultation Planning</h1>
            <p className="text-[#0A0908]/70 mt-2">View your team members' schedules for tomorrow</p>
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
                {currentEmployee.name}'s Schedule for Tomorrow
              </h2>
              <p className="text-sm text-[#0A0908]/80">
                {tomorrow.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {/* Tomorrow's Schedule */}
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#3d5a80] to-[#3d5a80]/90 text-white p-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <h2 className="text-xl font-semibold">Daily Schedule</h2>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="grid grid-rows-2 bg-[#3d5a80]/5">
                {/* Header Row - Hours */}
                <div className="grid grid-cols-11">
                  <div className="p-4 font-medium text-center border-b border-[#0A0908]/10">Time</div>
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="p-4 font-medium text-center border-b border-[#0A0908]/10"
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>

                {/* Single row for tomorrow's schedule */}
                <div className="grid grid-cols-11 border-t border-[#0A0908]/10">
                  {/* Day Name */}
                  <div className="p-4 text-center border-r border-[#0A0908]/10 font-medium">
                    {tomorrowDayName.charAt(0).toUpperCase() + tomorrowDayName.slice(1)}
                  </div>

                  {/* Time Slots */}
                  {timeSlots.map((hour) => (
                    <div
                      key={`${hour}`}
                      className={`p-4 text-center border-r border-[#0A0908]/10 last:border-r-0 relative h-16`}
                    >
                      {isWorkingHour(hour) ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-gradient-to-r from-[#2ec4b6] to-[#2ec4b6]/90 text-white py-2 px-3 shadow-md w-full transform transition-transform hover:scale-105">
                            <div className="flex items-center justify-center">
                              <Clock className="h-4 w-4 mr-1" />
                            
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  )
}