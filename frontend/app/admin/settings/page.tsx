"use client"
import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, RefreshCw, QrCode, Bell, Shield, AlertTriangle } from "lucide-react"
import { pointingApi } from "@/lib/api"
import { showErrorToast, showSuccessToast } from "@/lib/toast"

interface SystemSettings {
  POINTING_QR_ENABLED: boolean
  POINTING_FACE_RECOGNITION_ENABLED: boolean
  POINTING_MANUAL_ENABLED: boolean
  NOTIFICATIONS_ENABLED: boolean
  MAINTENANCE_MODE: boolean
  PLATFORM_NAME: string
}

export default function SystemSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<SystemSettings>({
    POINTING_QR_ENABLED: true,
    POINTING_FACE_RECOGNITION_ENABLED: true,
    POINTING_MANUAL_ENABLED: true,
    NOTIFICATIONS_ENABLED: true,
    MAINTENANCE_MODE: false,
    PLATFORM_NAME: "Pointing System"
  })

  // Fetch settings from backend
  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      const response = await pointingApi.getPointingSettings(token)
      setSettings(response.data as SystemSettings)
    } catch (error) {
      showErrorToast({
        title: "Failed to load settings",
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Save settings to backend
  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      await pointingApi.updatePointingSettings(settings, token)
      showSuccessToast({ title: "Settings saved successfully" })
    } catch (error) {
      showErrorToast({
        title: "Failed to save settings",
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggle = (setting: keyof SystemSettings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    })
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <RefreshCw className="h-12 w-12 animate-spin text-[#3d5a80]" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3d5a80]">System Settings</h1>
            <p className="text-[#0A0908]/70 mt-2">Configure the pointing system settings</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-[#2ec4b6] hover:bg-[#2ec4b6]/90" 
              onClick={handleSaveSettings} 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pointing Methods Card */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-[#3d5a80] text-white pb-4">
              <div className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                <CardTitle>Pointing Methods</CardTitle>
              </div>
              <CardDescription className="text-white/80">
                Configure available pointing methods
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">QR Code Pointing</Label>
                    <p className="text-sm text-[#0A0908]/70">Allow users to point using QR codes</p>
                  </div>
                  <Switch 
                    checked={settings.POINTING_QR_ENABLED} 
                    onCheckedChange={() => handleToggle("POINTING_QR_ENABLED")} 
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Face Recognition</Label>
                    <p className="text-sm text-[#0A0908]/70">Allow users to point using facial recognition</p>
                  </div>
                  <Switch 
                    checked={settings.POINTING_FACE_RECOGNITION_ENABLED} 
                    onCheckedChange={() => handleToggle("POINTING_FACE_RECOGNITION_ENABLED")} 
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Manual Pointing</Label>
                    <p className="text-sm text-[#0A0908]/70">Allow manual pointing by administrators</p>
                  </div>
                  <Switch 
                    checked={settings.POINTING_MANUAL_ENABLED} 
                    onCheckedChange={() => handleToggle("POINTING_MANUAL_ENABLED")} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-[#cbf3f0]/20 py-4">
              <div className="text-sm">
                {settings.POINTING_QR_ENABLED || 
                 settings.POINTING_FACE_RECOGNITION_ENABLED || 
                 settings.POINTING_MANUAL_ENABLED ? (
                  <Badge className="bg-green-100 text-green-800">Pointing Active</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">All Methods Disabled</Badge>
                )}
              </div>
            </CardFooter>
          </Card>

          {/* Notifications Card */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-[#3d5a80] text-white pb-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription className="text-white/80">
                Configure system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Notifications</Label>
                    <p className="text-sm text-[#0A0908]/70">Send system notifications to users</p>
                  </div>
                  <Switch 
                    checked={settings.NOTIFICATIONS_ENABLED} 
                    onCheckedChange={() => handleToggle("NOTIFICATIONS_ENABLED")} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-[#cbf3f0]/20 py-4">
              <div className="text-sm">
                {settings.NOTIFICATIONS_ENABLED ? (
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                )}
              </div>
            </CardFooter>
          </Card>

          {/* System Maintenance Card */}
          <Card className="border-none shadow-lg md:col-span-2">
            <CardHeader className="bg-[#3d5a80] text-white pb-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <CardTitle>System Maintenance</CardTitle>
              </div>
              <CardDescription className="text-white/80">
                Configure system maintenance options
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-[#0A0908]/70">
                      Put system in maintenance mode (only admins can access)
                    </p>
                  </div>
                  <Switch 
                    checked={settings.MAINTENANCE_MODE} 
                    onCheckedChange={() => handleToggle("MAINTENANCE_MODE")} 
                  />
                </div>

                {settings.MAINTENANCE_MODE && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="font-medium text-amber-800">Maintenance Mode Active</h3>
                    </div>
                    <p className="mt-2 text-sm text-amber-700">
                      The system is currently in maintenance mode. Only administrators can access the system.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-[#cbf3f0]/20 py-4">
              <div className="text-sm">
                {settings.MAINTENANCE_MODE ? (
                  <Badge className="bg-amber-100 text-amber-800">Maintenance Active</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">System Operational</Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}