"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  Clock,
  CalendarX,
  BrainCircuit,
  CalendarCheck,
  Fingerprint,
  UserCircle,
  BookOpenCheck,
  ClipboardList
} from "lucide-react";

import { ExitIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/lib/auth-context"; 
import { NotificationsDropdown } from "@/components/notifications-dropdown";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";


interface EmployeeLayoutProps {
  children: React.ReactNode
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const routes = [
    {
      name: "Planning",
      path: "/employee/planning",
      icon: CalendarDays,
    },
    {
      name: "Schedule",
      path: "/employee/schedule",
      icon: Clock,
    },
    {
      name: "consult-pointing",
      path: "/employee/consult-pointing",
      icon: CalendarX,
    },
    {
      name: "consult-schedule",
      path: "/employee/consult-schedule",
      icon: BrainCircuit,
    },
    {
      name: "Consut-planning",
      path: "/employee/consult-planning",
      icon: CalendarCheck,
    },
    {
      name: "pointing",
      path: "/employee/pointing",
      icon: Fingerprint,
    },
    {
      name: "Profile",
      path: "/employee/profile",
      icon: UserCircle,
    },
    {
      name: "consult-schedule-m",
      path: "/employee/consult-schedule-m",
      icon: BookOpenCheck,
    },
    {
      name: "edit-planning",
      path: "/employee/edit-planning",
      icon: ClipboardList,
    }
  ];
  

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col  bg-[180 20% 99%] w-full">
        <header className="sticky top-0 z-50 w-full bg-[#3d5a80] text-white shadow-md">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl">
          

            </div>

            <div className="flex items-center gap-4">
           
              <NotificationsDropdown />
              <SidebarTrigger className="md:hidden text-white hover:bg-[#1d3557]" />
            </div>
          </div>
        </header>

        <div className="flex flex-1 w-full">
          <Sidebar variant="inset" collapsible="icon" className="pt-10">
            <SidebarHeader className="py-4">
              <div className="flex items-center justify-center opacity-0">
              
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
                      <ExitIcon className="h-5 w-5 text-teal-100 group-hover/menu-button:text-white" />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 p-6 bg-[#cbf3f0] w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}