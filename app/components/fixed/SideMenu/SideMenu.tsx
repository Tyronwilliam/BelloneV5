"use client";

import {
  Calendar,
  HelpCircle,
  Home,
  Inbox,
  Landmark,
  LogOut,
  NotebookTabs,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AvatarDemo } from "../../reusable/Avatar/Avatar";
import { SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";

interface SideMenuProps {
  className?: string;
}

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Project",
    url: "/project",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Finance",
    url: "#",
    icon: Landmark,
  },
  {
    title: "Collaborator",
    url: "#",
    icon: Users,
  },
  {
    title: "Client",
    url: "#",
    icon: NotebookTabs,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
export default function SideMenu({ className }: SideMenuProps) {
  return (
    <Sidebar side="left">
      <SidebarContent>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroup>
          <div className="pb-2">
            <AvatarDemo />
          </div>
          <SidebarGroupContent>
            <SidebarContent>
              <div className=" py-2">
                <Input type="search" placeholder="Search..." />
              </div>
            </SidebarContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>{" "}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="destructive" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
