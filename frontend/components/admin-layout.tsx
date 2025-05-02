"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users2,
  LifeBuoy,
  Settings,
  LogOut,
} from "lucide-react"

import { useAuth } from  "@/lib/auth-context"
import { NotificationsDropdown } from "../components/notifications-dropdown"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "../components/ui/sidebar"
import path from "path"
import { UserCog } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const routes = [
    {
      name: "Users",
      path: "/admin/users",
      icon: UserCog, // UserCog represents managing users
    },
    {
      name: "System",
      path: "/admin/system",
      icon: LifeBuoy,
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: Users2,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    }
  ]
  

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-[#cbf3f0] w-full"> {/* Updated bg to match first page */}
        {/* Updated Header with dark blue */}
        <header className="sticky top-0 z-50 w-full bg-[#3d5a80] text-white shadow-md">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Link href="/patient/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="relative flex items-center">
                  <div className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full"></div>
                  <div className="absolute top-[10px] left-[21px] w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute top-[20px] left-[21px] w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-[28px] h-[48px]"></div> {/* spacer to give size to logo container */}
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <NotificationsDropdown />
              <SidebarTrigger className="md:hidden text-white hover:bg-[#1d3557]" />
            </div>
          </div>
        </header>

        <div className="flex flex-1 w-full">
          <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader className="py-4">
              <div className="flex items-center justify-center opacity-0">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-glow">
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {routes.map((route) => (
                  <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === route.path}
                      tooltip={route.name}
                      className="hover:bg-[#1d3557]"
                    >
                      <Link href={route.path}>
                        <route.icon className="h-6 w-6 text-teal-100 group-hover/menu-button:text-white" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    onClick={logout}
                    tooltip="Logout"
                    className="hover:bg-[#1d3557]"
                  >
                    <div className="flex items-center gap-2 p-4 w-full h-full justify-center group-data-[collapsible=icon]:justify-center">
                      <LogOut className="h-5 w-5 text-teal-100 group-hover/menu-button:text-white" />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 p-6 bg-[#cbf3f0] w-full">{children}</main> {/* Updated bg to match first page */}
        </div>
      </div>
    </SidebarProvider>
  )
}
