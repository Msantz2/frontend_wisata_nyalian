import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Toaster } from "sonner";
import { getNavigation, getSettings } from "@/lib/data";
import StructuredData from "@/components/seo/StructuredData";
import { createOrganizationSchema } from "@/lib/structuredData";
import { DestinationModalProvider } from "@/contexts/DestinationModalContext";
import { PackageModalProvider } from "@/contexts/PackageModalContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = getNavigation();
  const settings = getSettings();
  const organizationSchema = createOrganizationSchema(settings);

  return (
    <>
      <StructuredData data={organizationSchema} />
      <PackageModalProvider>
        <DestinationModalProvider>
          <Navbar navLinks={navLinks} />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
          <Toaster position="top-right" />
        </DestinationModalProvider>
      </PackageModalProvider>
    </>
  );
}
