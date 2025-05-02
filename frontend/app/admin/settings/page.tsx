"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Save,
  RefreshCw,
  QrCode,
  Eye,
  Bell,
  Calendar,
  Clock,
  Shield,
  FileText,
  Smartphone,
  Cpu,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SystemSettingsPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // System feature settings
  const [settings, setSettings] = useState({
    qrCodeEnabled: true,
    visualScanEnabled: true,
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: false,
    autoAppointmentRemindersEnabled: true,
    appointmentConfirmationRequired: true,
    userRegistrationApprovalRequired: false,
    maintenanceModeEnabled: false,
    debugModeEnabled: false,
    appointmentTimeSlotDuration: 30,
    maxAppointmentsPerDay: 20,
    appointmentCancellationTimeLimit: 24,
    defaultReminderTime: 2,
    systemTheme: "light",
  })

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof typeof settings],
    })
  }

  const handleSliderChange = (setting: keyof typeof settings, value: number[]) => {
    setSettings({
      ...settings,
      [setting]: value[0],
    })
  }

  const handleSelectChange = (setting: keyof typeof settings, value: string) => {
    setSettings({
      ...settings,
      [setting]: value,
    })
  }

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your system settings have been updated successfully.",
      })
    }, 1500)
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3d5a80]">System Settings</h1>
            <p className="text-[#0A0908]/70 mt-2">Configure the university appointment system settings</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-[#2ec4b6] hover:bg-[#2ec4b6]/90" onClick={handleSaveSettings} disabled={isSaving}>
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

        <Tabs defaultValue="features" className="mb-8">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="features" className="data-[state=active]:bg-[#3d5a80] data-[state=active]:text-white">
              Features
            </TabsTrigger>
      
            <TabsTrigger value="system" className="data-[state=active]:bg-[#3d5a80] data-[state=active]:text-white">
              System
            </TabsTrigger>
          </TabsList>

          {/* Features Tab */}
          <TabsContent value="features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-[#3d5a80] text-white pb-4">
                  <div className="flex items-center">
                    <QrCode className="h-5 w-5 mr-2" />
                    <CardTitle>QR Code System</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">
                    Configure QR code generation for appointments
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable QR Code System</Label>
                        <p className="text-sm text-[#0A0908]/70">Generate QR codes for appointment verification</p>
                      </div>
                      <Switch checked={settings.qrCodeEnabled} onCheckedChange={() => handleToggle("qrCodeEnabled")} />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>QR Code Information</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="qrName" checked={true} />
                          <Label htmlFor="qrName">User Name</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="qrId" checked={true} />
                          <Label htmlFor="qrId">Appointment ID</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="qrDate" checked={true} />
                          <Label htmlFor="qrDate">Date & Time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="qrLocation" checked={true} />
                          <Label htmlFor="qrLocation">Location</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>QR Code Expiration</Label>
                      <Select defaultValue="24">
                        <SelectTrigger>
                          <SelectValue placeholder="Select expiration time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour after appointment</SelectItem>
                          <SelectItem value="6">6 hours after appointment</SelectItem>
                          <SelectItem value="24">24 hours after appointment</SelectItem>
                          <SelectItem value="never">Never expire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#cbf3f0]/20 py-4">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-sm">
                      {settings.qrCodeEnabled ? (
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="border-[#3d5a80] text-[#3d5a80]">
                      Test QR Code
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="bg-[#3d5a80] text-white pb-4">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    <CardTitle>Visual Scan System</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">Configure AI-powered visual scanning</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Visual Scan</Label>
                        <p className="text-sm text-[#0A0908]/70">Use AI to analyze uploaded images and documents</p>
                      </div>
                      <Switch
                        checked={settings.visualScanEnabled}
                        onCheckedChange={() => handleToggle("visualScanEnabled")}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>AI Model Selection</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger>
                          <SelectValue placeholder="Select AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (Faster)</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="advanced">Advanced (More Accurate)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Processing Priority</Label>
                        <span className="text-sm font-medium">Medium</span>
                      </div>
                      <Slider defaultValue={[2]} max={3} step={1} className="w-full" />
                      <div className="flex justify-between text-xs text-[#0A0908]/70">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Scan Types</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="scanMedical" checked={true} />
                          <Label htmlFor="scanMedical">Medical Records</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="scanId" checked={true} />
                          <Label htmlFor="scanId">ID Documents</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="scanForms" checked={true} />
                          <Label htmlFor="scanForms">Forms</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="scanOther" checked={false} />
                          <Label htmlFor="scanOther">Other Documents</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#cbf3f0]/20 py-4">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-sm">
                      {settings.visualScanEnabled ? (
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="border-[#3d5a80] text-[#3d5a80]">
                      Test Scan
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="bg-[#3d5a80] text-white pb-4">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    <CardTitle>Notifications</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">Configure system notifications</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-[#0A0908]/70">Send email notifications for appointments</p>
                      </div>
                      <Switch
                        checked={settings.emailNotificationsEnabled}
                        onCheckedChange={() => handleToggle("emailNotificationsEnabled")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-[#0A0908]/70">Send SMS notifications for appointments</p>
                      </div>
                      <Switch
                        checked={settings.smsNotificationsEnabled}
                        onCheckedChange={() => handleToggle("smsNotificationsEnabled")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Automatic Reminders</Label>
                        <p className="text-sm text-[#0A0908]/70">Send automatic appointment reminders</p>
                      </div>
                      <Switch
                        checked={settings.autoAppointmentRemindersEnabled}
                        onCheckedChange={() => handleToggle("autoAppointmentRemindersEnabled")}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Default Reminder Time</Label>
                      <Select
                        value={settings.defaultReminderTime.toString()}
                        onValueChange={(value) => handleSelectChange("defaultReminderTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select reminder time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour before</SelectItem>
                          <SelectItem value="2">2 hours before</SelectItem>
                          <SelectItem value="24">24 hours before</SelectItem>
                          <SelectItem value="48">48 hours before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#cbf3f0]/20 py-4">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-sm">
                      {settings.emailNotificationsEnabled || settings.smsNotificationsEnabled ? (
                        <Badge className="bg-green-100 text-green-800">Notifications Active</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Notifications Disabled</Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="border-[#3d5a80] text-[#3d5a80]">
                      Test Notification
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="bg-[#3d5a80] text-white pb-4">
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    <CardTitle>Mobile App Integration</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">Configure mobile app settings</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-[#0A0908]/70">Send push notifications to mobile app</p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Biometric Authentication</Label>
                        <p className="text-sm text-[#0A0908]/70">Allow fingerprint/face login on mobile</p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Offline Mode</Label>
                        <p className="text-sm text-[#0A0908]/70">Allow limited functionality without internet</p>
                      </div>
                      <Switch checked={false} />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>App Version Requirements</Label>
                      <Select defaultValue="recommend">
                        <SelectTrigger>
                          <SelectValue placeholder="Select version policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="force">Force Latest Version</SelectItem>
                          <SelectItem value="recommend">Recommend Updates</SelectItem>
                          <SelectItem value="none">No Requirements</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#cbf3f0]/20 py-4">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-sm">
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="text-sm text-[#0A0908]/70">Current version: 2.4.1</div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>


          {/* System Tab */}
          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-[#3d5a80] text-white pb-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <CardTitle>Security Settings</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">Configure system security options</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Require Registration Approval</Label>
                        <p className="text-sm text-[#0A0908]/70">Manually approve new user registrations</p>
                      </div>
                      <Switch
                        checked={settings.userRegistrationApprovalRequired}
                        onCheckedChange={() => handleToggle("userRegistrationApprovalRequired")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-[#0A0908]/70">Require 2FA for admin accounts</p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Session Timeout</Label>
                        <p className="text-sm text-[#0A0908]/70">Automatically log out inactive users</p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Password Policy</Label>
                      <Select defaultValue="strong">
                        <SelectTrigger>
                          <SelectValue placeholder="Select password policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                          <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                          <SelectItem value="strong">Strong (8+ chars, mixed case, numbers, symbols)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Session Timeout Period</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeout period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#cbf3f0]/20 py-4">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-sm">
                      <Badge className="bg-green-100 text-green-800">Secure</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#3d5a80] text-[#3d5a80]">
                      Security Audit
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="bg-[#3d5a80] text-white pb-4">
                  <div className="flex items-center">
                    <Cpu className="h-5 w-5 mr-2" />
                    <CardTitle>System Maintenance</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">Configure system maintenance options</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Maintenance Mode</Label>
                        <p className="text-sm text-[#0A0908]/70">Put system in maintenance mode</p>
                      </div>
                      <Switch
                        checked={settings.maintenanceModeEnabled}
                        onCheckedChange={() => handleToggle("maintenanceModeEnabled")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Debug Mode</Label>
                        <p className="text-sm text-[#0A0908]/70">Enable detailed error logging</p>
                      </div>
                      <Switch
                        checked={settings.debugModeEnabled}
                        onCheckedChange={() => handleToggle("debugModeEnabled")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Automatic Backups</Label>
                        <p className="text-sm text-[#0A0908]/70">Schedule automatic system backups</p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Backup Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue placeholder="Select backup frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Log Level</Label>
                      <Select defaultValue="error">
                        <SelectTrigger>
                          <SelectValue placeholder="Select log level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debug">Debug (Verbose)</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#cbf3f0]/20 py-4">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-sm">
                      {settings.maintenanceModeEnabled ? (
                        <Badge className="bg-amber-100 text-amber-800">Maintenance Mode</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">System Online</Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="border-[#3d5a80] text-[#3d5a80]">
                      Run Backup
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg md:col-span-2">
                <CardHeader className="bg-[#3d5a80] text-white pb-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    <CardTitle>System Information</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">View system information and status</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">System Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-[#0A0908]/70">Version:</span>
                          <span className="font-medium">3.2.1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#0A0908]/70">Last Updated:</span>
                          <span className="font-medium">May 15, 2023</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#0A0908]/70">Environment:</span>
                          <span className="font-medium">Production</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#0A0908]/70">Database:</span>
                          <span className="font-medium">PostgreSQL 14.2</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#0A0908]/70">Server:</span>
                          <span className="font-medium">Node.js 18.12.1</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">System Status</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[#0A0908]/70">Database Connection:</span>
                          <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#0A0908]/70">Email Service:</span>
                          <Badge className="bg-green-100 text-green-800">Operational</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#0A0908]/70">Storage:</span>
                          <Badge className="bg-amber-100 text-amber-800">80% Used</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#0A0908]/70">API Services:</span>
                          <Badge className="bg-green-100 text-green-800">Operational</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#0A0908]/70">Last Backup:</span>
                          <span className="font-medium">Today, 03:00 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {settings.maintenanceModeEnabled && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                        <h3 className="font-medium text-amber-800">Maintenance Mode Active</h3>
                      </div>
                      <p className="mt-2 text-sm text-amber-700">
                        The system is currently in maintenance mode. Only administrators can access the system.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-[#cbf3f0]/20 py-4">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-sm text-[#0A0908]/70">System uptime: 45 days, 12 hours</div>
                    <Button variant="outline" size="sm" className="border-[#3d5a80] text-[#3d5a80]">
                      View System Logs
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
