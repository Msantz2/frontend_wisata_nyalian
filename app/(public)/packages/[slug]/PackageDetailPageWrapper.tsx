"use client";

import { ReactNode } from "react";
import PackageModal from "@/components/package/PackageModal";
import DestinationModal from "@/components/destination/DestinationModal";
import type { TourPackage } from "@/types/package";
import type { Destination } from "@/types/destination";

interface PackageDetailPageWrapperProps {
  children: ReactNode;
  allPackages: TourPackage[];
  allDestinations: Destination[];
}

export default function PackageDetailPageWrapper({
  children,
  allPackages,
  allDestinations,
}: PackageDetailPageWrapperProps) {
  return (
    <>
      {children}
      <PackageModal allPackages={allPackages} allDestinations={allDestinations} />
      <DestinationModal allDestinations={allDestinations} />
    </>
  );
}
