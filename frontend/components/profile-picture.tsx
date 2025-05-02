"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { Upload, Loader2 } from "lucide-react"
import { profileApi } from "@/lib/api"

interface ProfilePictureProps {
  userId: string
  firstName: string
  lastName: string
  editable?: boolean
  size?: "sm" | "md" | "lg"
  onPictureChange?: () => void
}

export function ProfilePicture({
  userId,
  firstName,
  lastName,
  editable = false,
  size = "md",
  onPictureChange,
}: ProfilePictureProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [key, setKey] = useState(Date.now())

  // Get initials for the avatar fallback
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  // Determine avatar size
  const sizeClass = {
    sm: "h-10 w-10",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  }[size]

  // Fetch profile picture when component mounts or userId changes
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await profileApi.getProfilePicture(userId, token)
        const url = URL.createObjectURL(response.data as Blob)
        setImageUrl(url)
      } catch (error) {
        setImageUrl(null)
      }
    }

    fetchProfilePicture()

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [userId, key])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      const formData = new FormData()
      formData.append("picture", file)  // Changed from "file" to "picture" to match your backend

      await profileApi.changeProfilePicture(formData, token)

      showSuccessToast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      })

      // Refresh the image by updating the key
      setKey(Date.now())

      if (onPictureChange) {
        onPictureChange()
      }
    } catch (error) {
      showErrorToast({
        title: "Failed to update profile picture",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative">
      <Avatar className={sizeClass}>
        <AvatarImage 
          src={imageUrl || undefined} 
          alt={`${firstName} ${lastName}`}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {editable && (
        <div className="absolute bottom-0 right-0">
          <label htmlFor="profile-picture-upload">
            <div className="bg-teal-600 text-white rounded-full p-2 cursor-pointer shadow-md">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </div>
            <input
              id="profile-picture-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  )
}