"use client";

import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onClear?: () => void;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  title = "Filters",
  children,
  onClear,
}: FilterDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-heading text-2xl text-primary">
              {title}
            </SheetTitle>
            <SheetClose asChild>
              <button
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="Close filters"
              >
                <X className="w-6 h-6" />
              </button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="space-y-6">{children}</div>

        {onClear && (
          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onClear();
                onClose();
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
