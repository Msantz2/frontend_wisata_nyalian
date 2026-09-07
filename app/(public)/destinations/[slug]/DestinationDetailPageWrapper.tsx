"use client";

import { ReactNode } from "react";
import DestinationModal from "@/components/destination/DestinationModal";
import type { Destination } from "@/types/destination";

interface DestinationDetailPageWrapperProps {
  children: ReactNode;
  allDestinations: Destination[];
}

export default function DestinationDetailPageWrapper({
  children,
  allDestinations,
}: DestinationDetailPageWrapperProps) {
  return (
    <>
      {children}
      <DestinationModal allDestinations={allDestinations} />
    </>
  );
}
