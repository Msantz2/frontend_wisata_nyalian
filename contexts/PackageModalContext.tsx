"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { TourPackage } from "@/types/package";

interface PackageModalContextType {
  isOpen: boolean;
  package: TourPackage | null;
  openModal: (pkg: TourPackage) => void;
  closeModal: () => void;
  switchPackage: (pkg: TourPackage) => void;
}

const PackageModalContext = createContext<PackageModalContextType | undefined>(undefined);

export function PackageModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [packageData, setPackageData] = useState<TourPackage | null>(null);

  const openModal = (pkg: TourPackage) => {
    setPackageData(pkg);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setPackageData(null), 300);
    document.body.style.overflow = "unset";
  };

  const switchPackage = (pkg: TourPackage) => {
    setPackageData(pkg);
  };

  return (
    <PackageModalContext.Provider value={{ isOpen, package: packageData, openModal, closeModal, switchPackage }}>
      {children}
    </PackageModalContext.Provider>
  );
}

export function usePackageModal() {
  const context = useContext(PackageModalContext);
  if (context === undefined) {
    throw new Error("usePackageModal must be used within a PackageModalProvider");
  }
  return context;
}
