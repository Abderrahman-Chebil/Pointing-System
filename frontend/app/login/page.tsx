"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { Loader2, GraduationCap } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image" // Import Image component from Next.js

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call login function from the AuthContext instead of fetching directly
      await login(formData.email, formData.password)

      showSuccessToast({
        title: "Login successful",
        description: "You have successfully logged in.",
      })

   // Update the route based on your user role logic

    } catch (error) {
      showErrorToast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Information with background image */}
      <div className="hidden md:flex md:w-3/5 bg-cover bg-center relative" style={{ backgroundImage: 'url("/sign_in_pg.jpg")' }}>
        <div className="absolute inset-0 bg-[black]/30 z-10"></div> {/* Overlay for better text visibility */}
        <div className="relative z-20 p-8 text-white flex flex-col justify-end h-full">
          <h1 className="text-xl font-bold mb-1">University Appointment System</h1>
          <p className="mb-8 text-xs">Schedule and manage appointments with university staff and faculty members</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-2/5 bg-[#87bcde] flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="rounded-full bg-[#FEFCFD] p-3 mb-4">
              <GraduationCap className="h-6 w-6 text-[#3d5a80]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A0908]">Employee Login</h2>
            <p className="text-[#0A0908]/70 text-center">Sign in to access your appointment dashboard</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0A0908]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@university.edu"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="border-[#3d5a80] focus:border-[#3d5a80] focus:ring-[#3d5a80]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#0A0908]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="border-[#3d5a80] focus:border-[#3d5a80] focus:ring-[#3d5a80]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-[#3d5a80] data-[state=checked]:bg-[#3d5a80]"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#0A0908]"
                >
                  Remember me
                </label>
              </div>

              <Button 
                type="submit"
                className="w-full bg-[#3d5a80] hover:bg-[#3d5a80]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center text-xs text-[#0A0908]/60">
            <p>© 2025 University Appointment System</p>
          </div>
        </div>
      </div>
    </div>
  )
}
