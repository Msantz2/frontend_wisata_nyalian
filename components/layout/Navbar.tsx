"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import type { NavigationItem } from "@/types/navigation";

interface NavbarProps {
  navLinks: NavigationItem[];
}

export default function Navbar({ navLinks }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-sm shadow-md"
            : "bg-background/90 backdrop-blur-sm border-b border-border/20"
        }`}
        role="banner"
      >
        <nav className="max-w-container mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Brand Name - Left Aligned */}
            <Link
              href="/"
              className="flex items-center space-x-3 font-heading text-xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
            >
              <Image
                src="/images/logonyalian.webp"
                alt="Desa Wisata Nyalian Logo"
                width={48}
                height={48}
                className="h-10 w-10 md:h-12 md:w-12 object-contain"
                priority
              />
              <span className="hidden sm:inline whitespace-nowrap">Desa Wisata Nyalian</span>
              <span className="sm:hidden whitespace-nowrap">Nyalian</span>
            </Link>

            {/* Desktop Navigation - Right Aligned */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-body font-semibold transition-colors ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-text-primary hover:text-primary"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-background-light transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-text-primary" />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
}
