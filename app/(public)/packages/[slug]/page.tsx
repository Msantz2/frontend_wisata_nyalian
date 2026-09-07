import { notFound } from "next/navigation";
import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Clock, Users, Star, CheckCircle, XCircle } from "lucide-react";
import { getPackages, getPackageBySlug, getDestinations } from "@/lib/data";
import { formatCurrency } from "@/utils/formatCurrency";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { getSettings } from "@/lib/data";
import SectionContainer from "@/components/shared/SectionContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import SocialShare from "@/components/shared/SocialShare";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import ImageGallery from "@/components/gallery/ImageGallery";
import DestinationCard from "@/components/destination/DestinationCard";
import PackageCard from "@/components/package/PackageCard";
import DetailHero from "@/components/shared/DetailHero";
import PackageDetailPageWrapper from "./PackageDetailPageWrapper";

interface PackagePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const packages = await getPackages();
  return packages
    .filter(pkg => pkg.slug && pkg.slug.trim().length > 0)
    .map((pkg) => ({
      slug: pkg.slug,
    }));
}

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;

  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    return buildMetadata({
      title: "Paket Tidak Ditemukan",
      description: "Paket yang Anda cari tidak dapat ditemukan.",
      path: `/packages/${slug}`,
    });
  }

   return buildMetadata({
     title: pkg.name,
     description: pkg.shortDescription,
     path: `/packages/${slug}`,
     image: pkg.fullImageUrl || undefined,
     keywords: [pkg.name, pkg.category, "Paket tur Bali", "Desa Nyalian", ...pkg.highlights.slice(0, 3)],
   });
}

export default async function PackageDetailPage({
  params,
}: PackagePageProps) {
  const { slug } = await params;

  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const settings = getSettings();
  const allDestinations = await getDestinations();
  const allPackages = await getPackages();

  const linkedDestinations = pkg.destinations
    .map((id) => allDestinations.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => d !== undefined);

  const relatedPackages = allPackages
    .filter(
      (p) =>
        p.id !== pkg.id &&
        (p.category === pkg.category || p.duration.includes(pkg.duration.split(" ")[0]))
    )
    .slice(0, 3);

  if (relatedPackages.length < 3) {
    const additionalPackages = allPackages
      .filter((p) => p.id !== pkg.id && p.featured && !relatedPackages.find((rp) => rp.id === p.id))
      .slice(0, 3 - relatedPackages.length);
    relatedPackages.push(...additionalPackages);
  }

  const whatsappMessage = `Hello, I am interested in the ${pkg.name}. Could you please provide more information? Thank you.`;

  return (
    <PackageDetailPageWrapper allPackages={allPackages} allDestinations={allDestinations}>
      <>
        <DetailHero
          backgroundImage={getPlaceholderImage(pkg.fullImageUrl)}
          title={pkg.name}
          category={pkg.category}
          featured={pkg.featured}
          metadata={
            <div className="flex flex-wrap items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{pkg.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="font-semibold">{pkg.rating ? pkg.rating.toFixed(1) : 'N/A'}</span>
              </div>
              <div className="text-xl font-bold">
                From {typeof pkg.price === 'number' ? formatCurrency(pkg.price) : pkg.price}
              </div>
            </div>
          }
        />

        <SectionContainer className="py-12">
          <Breadcrumb
            items={[
              { label: "Paket", href: "/packages" },
              { label: pkg.name },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                  Gambaran Umum
                </h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  {pkg.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-text-muted">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{pkg.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent fill-accent" />
                    <span className="font-semibold text-text-primary">
                      {pkg.rating ? pkg.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                  Sorotan
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pkg.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                  Yang Disertakan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Disertakan
                    </h3>
                    <ul className="space-y-2">
                      {pkg.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-text-muted" />
                      Tidak Disertakan
                    </h3>
                    <ul className="space-y-2">
                      {pkg.excluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-text-muted mt-1">•</span>
                          <span className="text-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

                <section>
                  <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                    Itinerary
                  </h2>
                  <div className="space-y-0">
                    {pkg.itinerary.map((item, index) => {
                      let time = '';
                      let activity = '';
                      
                      if (typeof item === 'object' && item !== null) {
                        time = (item as any).time || (item as any).waktu || '';
                        activity = (item as any).activity || '';
                      } else {
                        const [t, ...activityParts] = String(item).split(" - ");
                        time = t || '';
                        activity = activityParts.join(" - ");
                      }
                      
                      return (
                        <div key={index} className="flex gap-3 py-2">
                          <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                            <div className="w-12 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/30 px-2">
                              <span className="text-xs font-bold text-primary whitespace-nowrap">
                                {time}
                              </span>
                            </div>
                            {index < pkg.itinerary.length - 1 && (
                              <div className="w-0.5 h-3 bg-primary/20 my-0" />
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-start">
                            <p className="text-sm text-text-secondary leading-snug pt-1">{activity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

              {linkedDestinations.length > 0 && (
                <section>
                  <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                    Destinasi yang Disertakan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {linkedDestinations.map((destination) => (
                      <DestinationCard
                        key={destination.id}
                        destination={destination}
                      />
                    ))}
                  </div>
                </section>
              )}

              {relatedPackages.length > 0 && (
                <section>
                  <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                    Anda Mungkin Juga Suka
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPackages.map((relatedPkg) => (
                      <PackageCard key={relatedPkg.id} package={relatedPkg} />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center gap-4">
                  <SocialShare
                    title={pkg.name}
                    description={pkg.shortDescription}
                  />
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                  <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                    Informasi Pemesanan
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-text-muted mb-1">Mulai dari</p>
                      <p className="text-3xl font-bold text-primary">
                        {typeof pkg.price === 'number' ? formatCurrency(pkg.price) : pkg.price}
                      </p>
                      <p className="text-sm text-text-muted">per orang</p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-text-muted">Durasi</span>
                        <span className="font-semibold text-text-primary">
                          {pkg.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Ukuran grup</span>
                        <span className="font-semibold text-text-primary">
                          {pkg.capacity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <WhatsAppCTA
                    phone={settings.whatsapp}
                    message={whatsappMessage}
                    label="Pesan Paket Ini"
                    size="lg"
                  />

                  <p className="text-xs text-text-muted mt-4 text-center">
                    Hubungi kami via WhatsApp untuk ketersediaan dan pemesanan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </>
    </PackageDetailPageWrapper>
  );
}
