"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Destination } from "@/types/destination";

interface DestinationModalContextType {
  isOpen: boolean;
  destination: Destination | null;
  openModal: (destination: Destination) => void;
  closeModal: () => void;
  switchDestination: (destination: Destination) => void;
}

const DestinationModalContext = createContext<DestinationModalContextType | undefined>(undefined);

export function DestinationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [destination, setDestination] = useState<Destination | null>(null);

  const openModal = (dest: Destination) => {
    setDestination(dest);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setDestination(null), 300);
    document.body.style.overflow = "unset";
  };

  const switchDestination = (dest: Destination) => {
    setDestination(dest);
  };

  return (
    <DestinationModalContext.Provider value={{ isOpen, destination, openModal, closeModal, switchDestination }}>
      {children}
    </DestinationModalContext.Provider>
  );
}

export function useDestinationModal() {
  const context = useContext(DestinationModalContext);
  if (context === undefined) {
    throw new Error("useDestinationModal must be used within a DestinationModalProvider");
  }
  return context;
}
