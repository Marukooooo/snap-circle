"use client";

import Link from "next/link";
import { Home, Compass, PlusSquare, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function BottomBar() {
  const { user } = useUser();

  const items = [
    { href: "/", label: "关注", icon: Home },
    { href: "/explore", label: "探索", icon: Compass },
    { href: "/publish", label: "发布", icon: PlusSquare },
    {
      href: user?.username ? `/profile/${user.username}` : "/sign-in",
      label: "我的",
      icon: User,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-white flex justify-around items-center z-20 mt-3">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <div className="flex flex-col items-center text-sm">
            <item.icon className="h-6 w-6" />
            <span>{item.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
