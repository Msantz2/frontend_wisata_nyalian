"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import type { NavigationItem } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavigationItem[];
}

export default function MobileMenu({
  isOpen,
  onClose,
  navLinks,
}: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl text-primary">
            Menu
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-2 mt-8">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="text-base sm:text-lg font-body font-semibold text-text-primary hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-background-light min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
