"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authApi, profileApi } from "@/lib/api"

type Employee = {
  id: number
  email: string
  first_name: string
  last_name: string
  birth_date?: string
  gender?: string
  job?: string
  phone?: string
  address?: string
  start_date?: string
  is_active?: boolean
  is_chief?: boolean
  is_manager?: boolean
  role: "employee" | "manager" | "chief" | "admin"
}

type AuthContextType = {
  employee: Employee | null
  token: string | null
  isLoading: boolean
  isChief: boolean | null
  isManager: boolean | null
  login: (email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  updateEmployee: (employeeData: Partial<Employee>) => void
  refreshEmployee: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isChief, setIsChief] = useState<boolean | null>(null)
  const [isManager, setIsManager] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedEmployee = localStorage.getItem("employee")

    if (storedToken && storedEmployee) {
      setToken(storedToken)
      const parsedEmployee = JSON.parse(storedEmployee)
      setEmployee(parsedEmployee)
      setIsChief(parsedEmployee.is_chief || false)
      setIsManager(parsedEmployee.is_manager || false)
    }

    setIsLoading(false)
  }, [])

  // Fetch employee profile when token changes
  useEffect(() => {
    if (token && !employee) {
      refreshEmployee()
    }
  }, [token, employee])

  const refreshEmployee = async () => {
    if (!token) return

    try {
      const employeeData = await profileApi.getMyProfile(token)
      const data = employeeData.data as Employee
      
      // Determine role with "employee" as default
      let role: "employee" | "manager" | "chief" | "admin" = "employee"
      if (data.is_chief) role = "chief"
      else if (data.is_manager) role = "manager"
      
      const updatedEmployee = {
        ...data,
        role
      }

      setEmployee(updatedEmployee)
      setIsChief(data.is_chief || false)
      setIsManager(data.is_manager || false)
      localStorage.setItem("employee", JSON.stringify(updatedEmployee))
    } catch (error) {
      console.error("Failed to fetch employee profile:", error)
      if (error instanceof Error && error.message.includes("401")) {
        logout()
      }
    }
  }

  const login = async (email: string, password: string, role?: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.login({ email, password, role })
      const { token: authToken, role: authRole } = response.data as { token: string; role: string }
      
      setToken(authToken)
      localStorage.setItem("token", authToken)

      // Set minimal employee object until full profile is fetched
      const newEmployee = {
        id: 0,
        email,
        first_name: "",
        last_name: "",
        role: authRole as "employee" | "manager" | "chief" | "admin",
        is_chief: authRole === "chief",
        is_manager: authRole === "manager"
      }

      setEmployee(newEmployee)
      setIsChief(authRole === "chief")
      setIsManager(authRole === "manager")
      localStorage.setItem("employee", JSON.stringify(newEmployee))

      // Redirect based on role
      if (authRole === "admin") {
        router.push("/admin/profile")
      } else if (authRole === "manager") {
        router.push("/manager/profile")
      } else if (authRole === "chief") {
        router.push("/chief/profile")
      } else {
        router.push("/employee/profile")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setEmployee(null)
    setToken(null)
    setIsChief(null)
    setIsManager(null)
    localStorage.removeItem("token")
    localStorage.removeItem("employee")
    router.push("/login")
  }

  const updateEmployee = (employeeData: Partial<Employee>) => {
    if (employee) {
      const updatedEmployee = { ...employee, ...employeeData }
      setEmployee(updatedEmployee)
      setIsChief(employeeData.is_chief ?? employee.is_chief ?? false)
      setIsManager(employeeData.is_manager ?? employee.is_manager ?? false)
      localStorage.setItem("employee", JSON.stringify(updatedEmployee))
    }
  }

  return (
    <AuthContext.Provider value={{ 
      employee,
      token, 
      isLoading,
      isChief,
      isManager,
      login, 
      logout, 
      updateEmployee,
      refreshEmployee
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}