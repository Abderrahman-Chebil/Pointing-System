"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { notificationApi } from "@/lib/api";




interface Notification {
  id: string
  type: string
  description: string
  creation_date: string
  is_read: boolean
}

export function NotificationsDropdown() {
  
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("authToken") || "";
      const response = await notificationApi.getNotifications(token)
      setNotifications(response.data as Notification[])
    } catch (error) {
      showErrorToast
      ({
        title: "Failed to load notifications",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/notifications_count/", {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch notification count")
      }

      const data = await response.json()
      setNotificationCount(data.count)
    } catch (error) {
      console.error("Error fetching notification count:", error)
    }
  }

  useEffect(() => {
    fetchNotificationCount()

    // Set up interval to refresh count every minute
    const interval = setInterval(fetchNotificationCount, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  // Update the toast implementation to ensure it works correctly
  const handleDeleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken") || "";
      await notificationApi.deleteNotification({ id }, token)
      setNotifications(notifications.filter((n) => n.id !== id))
      fetchNotificationCount() // Refresh count after deletion

      // Make sure we're calling toast correctly
      showSuccessToast({
        title: "Notification deleted",
        description: "The notification has been deleted successfully",
      })
    } catch (error) {
      // Make sure we're calling toast correctly for errors
      showErrorToast({
        title: "Failed to delete notification",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {notificationCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
              <div className="flex w-full justify-between">
                <span className="font-medium">{notification.type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  Delete
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
              <div className="flex w-full justify-between mt-2">
                <span className="text-xs text-muted-foreground">{formatDate(notification.creation_date)}</span>
                {!notification.is_read && (
                  <Badge variant="outline" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

