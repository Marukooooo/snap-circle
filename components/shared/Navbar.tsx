"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { SidebarTrigger } from "@/components/ui/sidebar";
import NavbarSearch from "./search/NavbarSearch";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4">
      {/* Left - Sidebar trigger */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 justify-center px-6">
        <NavbarSearch />
      </div>

      {/* Right - User */}
      <div className="flex items-center gap-4">
        <ClerkLoading>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-r-transparent" />
        </ClerkLoading>

        <ClerkLoaded>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-primary hover:underline"
            >
              登录 / 注册
            </Link>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
}
