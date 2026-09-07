"use client";

import { ReactNode } from "react";
import DestinationModal from "@/components/destination/DestinationModal";
import PackageModal from "@/components/package/PackageModal";
import type { Destination } from "@/types/destination";
import type { TourPackage } from "@/types/package";

interface ArticlePageWrapperProps {
  children: ReactNode;
  allDestinations: Destination[];
  allPackages: TourPackage[];
}

export default function ArticlePageWrapper({
  children,
  allDestinations,
  allPackages,
}: ArticlePageWrapperProps) {
  return (
    <>
      {children}
      <DestinationModal allDestinations={allDestinations} />
      <PackageModal allPackages={allPackages} allDestinations={allDestinations} />
    </>
  );
}
