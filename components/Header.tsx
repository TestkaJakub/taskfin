"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full flex items-center justify-between p-4 bg-[var(--secondary)]">
      <Link href="/" className="text-xl font-bold text-(var[--secondary-foreground])">
        Taskfin
      </Link>

      <div className="flex items-center space-x-2">
        <ThemeToggle />

        {status === "authenticated" && session.user ? (
          <>
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm text-(var[--secondary-foreground])">
                {session.user.email}
              </span>
              <Button
                size="sm"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                Sign out
              </Button>
              <DeleteAccountButton />
            </div>

            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem className="cursor-default">
                    {session.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  >
                    Sign out
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DeleteAccountButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="text-sm hover:underline text-blue-600 dark:text-blue-400"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}