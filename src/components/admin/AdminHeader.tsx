"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminNavLinks } from "@/components/admin/AdminSidebar";
import { signOut } from "@/actions/auth";

interface AdminHeaderProps {
  user: {
    email?: string;
    full_name?: string;
    role?: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {/* Mobile navigation */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-soft-bg p-0">
              <SheetHeader className="border-b px-4 py-4">
                <SheetTitle className="text-navy">TPi Admin</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <AdminNavLinks onNavigate={() => setMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-navy">TPi Admin</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-navy text-white text-xs">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user.full_name || user.email}</p>
                <p className="text-xs text-muted-text capitalize">{user.role}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
