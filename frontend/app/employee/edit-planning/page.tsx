"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EmployeeLayout } from "@/components/employee-layout";
import { Calendar, Clock, Users, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { planningApi, userManagementApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context"; // Import useAuth hook

type DayName = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface EmployeeSchedules {
  [employeeId: string]: {
    [day in DayName]: number[];
  };
}




const days: DayName[] = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
const dayDisplayNames = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
};

const timeSlots = Array.from({ length: 10 }, (_, i) => i + 8);

export default function ManagerConsultationPlanningPage() {
  const { employee, isChief } = useAuth(); // Get auth state
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [schedules, setSchedules] = useState<EmployeeSchedules>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not chief
  useEffect(() => {
    if (!isLoading && !isChief) {
      showErrorToast({
        title: "Access Denied",
        description: "Only chiefs can access this page.",
      });
      // You might want to redirect here
      // router.push("/unauthorized");
    }
  }, [isChief, isLoading]);

  // Fetch team members (chief's team only)
  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showErrorToast({ title: "Authentication required" });
        return;
      }

      // Only proceed if user is chief
      if (!isChief) return;

      const response = await userManagementApi.manageUser.getAll(token);
      
      // Filter team members based on your business logic
      const users = response.data as Array<any>;
      const members = users.map((user: any) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        role: user.job || "Team Member",
        avatar: `${user.first_name[0]}${user.last_name[0]}`,
      }));

      setTeamMembers(members);
      if (members.length > 0) setSelectedEmployee(members[0].id);
    } catch (error) {
      showErrorToast({
        title: "Failed to load team members",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // Fetch schedules for a team member
  const fetchSchedule = async (employeeId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await planningApi.getOthersPlanning(employeeId, token);
      
      const backendData = response.data as Record<DayName, number[]>;
      const formattedSchedule: EmployeeSchedules = {
        [employeeId]: {
          sunday: backendData.sunday || [],
          monday: backendData.monday || [],
          tuesday: backendData.tuesday || [],
          wednesday: backendData.wednesday || [],
          thursday: backendData.thursday || [],
        },
      };

      setSchedules((prev) => ({ ...prev, ...formattedSchedule }));
    } catch (error) {
      showErrorToast({
        title: "Failed to load schedule",
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchTeamMembers();
      setIsLoading(false);
    };
    
    if (isChief) { // Only load data if user is chief
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isChief]);

  // Load schedule when employee changes
  useEffect(() => {
    if (selectedEmployee && isChief) {
      fetchSchedule(selectedEmployee);
    }
  }, [selectedEmployee, isChief]);

  // Save changes to backend
  const saveSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !isChief) return;

      const changes = {
        create: [],
        delete: [],
        modify: Object.entries(schedules[selectedEmployee]).flatMap(([day, hours]) =>
          hours.map((hour) => ({
            id: `${selectedEmployee}-${day}-${hour}`,
            day,
            start_time: `${hour}:00`,
            end_time: `${hour + 1}:00`,
            user: selectedEmployee,
          }))
        ),
      };

      await planningApi.managePlanning.bulkUpdate(changes, token);
      showSuccessToast({ title: "Schedule updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      showErrorToast({
        title: "Failed to save schedule",
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const toggleHour = (day: DayName, hour: number) => {
    if (!isEditing || !isChief) return;

    setSchedules((prev) => {
      const currentHours = [...(prev[selectedEmployee]?.[day] || [])];
      const index = currentHours.indexOf(hour);

      if (index >= 0) {
        currentHours.splice(index, 1);
      } else {
        currentHours.push(hour);
        currentHours.sort((a, b) => a - b);
      }

      useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("JWT Token Payload:", payload);
            console.log("Is Chief in Token:", payload.is_chief);
          } catch (e) {
            console.error("Error parsing token:", e);
          }
        }
      }, []);

      return {
        ...prev,
        [selectedEmployee]: {
          ...prev[selectedEmployee],
          [day]: currentHours,
        },
      };
    });
  };

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#3d5a80]"></div>
        </div>
      </EmployeeLayout>
    );
  }

  if (!isChief) {
    return (
      <EmployeeLayout>
        <div className="min-h-screen text-[#0A0908] p-4 md:p-8 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold text-[#3d5a80] mb-2">Access Restricted</h2>
              <p className="text-gray-600">You don't have permission to view this page.</p>
            </CardContent>
          </Card>
        </div>
      </EmployeeLayout>
    );
  }

  // Find the currently selected employee object
  const currentEmployee = teamMembers.find((member) => member.id === selectedEmployee);

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
          onClick={isEditing ? saveSchedule : () => setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isEditing ? "Save Changes" : "Edit Schedule"}
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
                    {timeSlots.map((hour) => {
                      // Helper to check if the hour is a working hour for the selected employee and day
                      const isWorkingHour = (day: DayName, hour: number) => {
                        return schedules[selectedEmployee]?.[day]?.includes(hour);
                      };
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