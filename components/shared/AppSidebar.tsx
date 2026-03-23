"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { Home, Compass, PlusSquare, User, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const navItems = [
    {
      href: "/",
      label: "首页",
      icon: Home,
    },
    {
      href: "/explore",
      label: "探索",
      icon: Compass,
    },
    {
      href: "/publish",
      label: "发布",
      icon: PlusSquare,
    },
    {
      href: "/ai-assistant",
      label: "AI助手",
      icon: Sparkles,
    },
    {
      href: user?.username ? `/profile/${user.username}` : "/sign-in",
      label: "个人主页",
      icon: User,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start px-2 py-2 font-bold"
        >
          <span className="text-xl group-data-[collapsible=icon]:hidden">
            SNAPCIRCLE
          </span>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            return (
              <SidebarMenuItem key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>

                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {user && (
          <Link
            href={`/profile/${user.username}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
              <span className="font-medium">{user.fullName}</span>
              <span className="text-muted-foreground text-xs">
                @{user.username}
              </span>
            </div>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
