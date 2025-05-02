"use client"
import { fetchFromBackend } from '@/lib/api';
import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { User, Mail, Phone, Calendar, Shield, X, UserCircle, AlertCircle, Edit, Clock } from "lucide-react"
import { ProfilePicture } from "@/components/profile-picture"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { profileApi } from "@/lib/api"

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  birth_date: string | null
  gender: string | null
  phone: string | null
  start_date?: string  // Added to match potential backend response
}

const renderGenderText = (gender: string | null) => {
  if (!gender) return "Not specified"

  const genderMap: Record<string, string> = {
    M: "Male",
    F: "Female",
  }

  return genderMap[gender] || "Not specified"
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const router = useRouter()
//
const loadProfile = async () => {
  setIsLoading(true);
  try {
    // You need to provide a valid token here
    const token = localStorage.getItem("token"); // or use your auth context/provider
    const response = await profileApi.getMyProfile(token as string);
    setProfile(response.data as UserProfile);
  } catch (error) {
    showErrorToast({
      title: "Failed to load profile",
      description: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    setIsLoading(false);
  }
};//


  useEffect(() => {
    
    loadProfile()
  }, [router])

  const getProfileCompleteness = () => {
    if (!profile) return 0

    const totalFields = Object.keys(profile).length
    const completedFields = Object.values(profile).filter((val) => val !== null && val !== "").length

    return Math.round((completedFields / totalFields) * 100)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#3d5a80] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <UserCircle className="h-10 w-10 text-[#3d5a80]" />
            </div>
          </div>
          <p className="text-lg mt-6 text-[#0A0908]">Loading your profile...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!profile) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <X className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Failed to load profile</h2>
          <p className="text-muted-foreground mb-4">We couldn't load your profile information.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-[#3d5a80] hover:bg-[#3d5a80]/90"
          >
            Try Again
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-shrink-0">
            <div className="relative">
              <ProfilePicture
                userId={profile.id}
                firstName={profile.first_name}
                lastName={profile.last_name}
                editable={false}
                size="lg"
              />
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#0A0908]">{`${profile.first_name} ${profile.last_name}`}</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-[#3d5a80]/10 text-[#3d5a80] hover:bg-[#3d5a80]/20">
                Admin
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-[#3d5a80]">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg text-[#f0f9f8]">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#f0f9f8] p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-[#3d5a80]" />
                    </div>
                    <div>
                      <p className="text-white text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{profile.birth_date || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-[#f0f9f8] p-2 rounded-lg">
                      <User className="h-5 w-5 text-[#3d5a80]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground text-white">Gender</p>
                      <p className="font-medium">{renderGenderText(profile.gender)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-[#f0f9f8] p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-[#3d5a80]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground text-white">Phone</p>
                      <p className="font-medium">{profile.phone|| "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-[#f0f9f8] p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-[#3d5a80]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground text-white">Member Since</p>
                      <p className="font-medium">
                        {profile.start_date ? new Date(profile.start_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-[#3d5a80]">
              <CardHeader>
                <CardTitle className="text-[#f0f9f8]">Contact Information</CardTitle>
                <CardDescription className="text-[#f0f9f8]">
                  Your personal contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2 text-[#f0f9f8]">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" className="text-[#3d5a80]" value={profile.first_name} readOnly />
                  </div>

                  <div className="space-y-2 text-[#f0f9f8]">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" className="text-[#3d5a80]" value={profile.last_name} readOnly />
                  </div>

                  <div className="space-y-2 text-[#f0f9f8]">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input id="email" className="pl-10 text-[#3d5a80]" value={profile.email} readOnly />
                    </div>
                  </div>

                  <div className="space-y-2 text-[#f0f9f8]">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="phone"
                        className="pl-10 text-[#3d5a80]"
                        value={profile.phone|| ""}
                        readOnly
                      />
                    </div>
                    {!profile.phone && (
                      <p className="text-sm text-amber-300 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> Not specified
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}