"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authApi, profileApi } from "@/lib/api"

type Employee = {  // Changed from User to Employee
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
  role: "employee" | "manager" | "chief" | "admin" // Changed default role to "employee"
}

type AuthContextType = {
  employee: Employee | null  // Changed from user to employee
  token: string | null
  isLoading: boolean
  login: (email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  updateEmployee: (employeeData: Partial<Employee>) => void  // Changed from updateUser
  refreshEmployee: () => Promise<void>  // Changed from refreshUser
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null)  // Changed from user
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedEmployee = localStorage.getItem("employee")  // Changed from user

    if (storedToken && storedEmployee) {
      setToken(storedToken)
      setEmployee(JSON.parse(storedEmployee))
    }

    setIsLoading(false)
  }, [])

  // Fetch employee profile when token changes
  useEffect(() => {
    if (token && !employee) {
      refreshEmployee()
    }
  }, [token, employee])

  const refreshEmployee = async () => {  // Changed from refreshUser
    if (!token) return

    try {
      const employeeData = await profileApi.getMyProfile(token)
      // Assert the type of employeeData.data
      const data = employeeData.data as Employee
      // Determine role with "employee" as default
      let role: "employee" | "manager" | "chief" | "admin" = "employee"
      if (data.is_chief) role = "chief"
      else if (data.is_manager) role = "manager"
      
      const updatedEmployee = {  // Changed from updatedUser
        ...data,
        role
      }

      setEmployee(updatedEmployee)
      localStorage.setItem("employee", JSON.stringify(updatedEmployee))  // Changed from user
    } catch (error) {
      console.error("Failed to fetch employee profile:", error)  // Updated error message
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
      setEmployee({
        id: 0,
        email,
        first_name: "",
        last_name: "",
        role: authRole as "employee" | "manager" | "chief" | "admin"  // Updated role type
      })

      // Redirect based on role
      if (authRole === "admin") {
        router.push("/admin/profile")
      } else if (authRole === "manager") {
        router.push("/manager/profile")
      } else if (authRole === "chief") {
        router.push("/chief/profile")
      } else {
        router.push("/employee/profile")  // Default route for employees
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setEmployee(null)  // Changed from setUser
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("employee")  // Changed from user
    router.push("/login")
  }

  const updateEmployee = (employeeData: Partial<Employee>) => {  // Changed from updateUser
    if (employee) {
      const updatedEmployee = { ...employee, ...employeeData }  // Changed from updatedUser
      setEmployee(updatedEmployee)
      localStorage.setItem("employee", JSON.stringify(updatedEmployee))  // Changed from user
    }
  }

  return (
    <AuthContext.Provider value={{ 
      employee,  // Changed from user
      token, 
      isLoading, 
      login, 
      logout, 
      updateEmployee,  // Changed from updateUser
      refreshEmployee  // Changed from refreshUser
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
  return context}