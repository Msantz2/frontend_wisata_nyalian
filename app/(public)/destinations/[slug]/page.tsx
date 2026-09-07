import { notFound } from "next/navigation";
import { getDestinations, getDestinationBySlug, getVideos, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { createTouristAttractionSchema, createBreadcrumbSchema } from "@/lib/structuredData";
import type { Metadata } from "next";
import DestinationDetailContent from "@/components/destination/DestinationDetailContent";
import DestinationDetailPageWrapper from "./DestinationDetailPageWrapper";
import StructuredData from "@/components/seo/StructuredData";

interface DestinationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations
    .filter(destination => destination.slug && destination.slug.trim().length > 0)
    .map((destination) => ({
      slug: destination.slug,
    }));
}

export async function generateMetadata(
  { params }: DestinationPageProps
): Promise<Metadata> {

  const { slug } = await params;

  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return buildMetadata({
      title: "Destination Not Found",
      description: "The destination you are looking for could not be found.",
      path: `/destinations/${slug}`,
    });
  }

  return buildMetadata({
    title: destination.name,
    description: destination.shortDescription || destination.description,
    path: `/destinations/${slug}`,
    image: destination.fullImageUrl || undefined,
    keywords: [
      destination.name,
      destination.category,
      "Desa Nyalian",
      "destinasi Bali",
      ...destination.facilities.slice(0, 3),
    ],
  });
}

export default async function DestinationPage({
  params,
}: DestinationPageProps) {

  const { slug } = await params;

  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const allVideos = getVideos();
  const destinationVideos = allVideos.filter(
    (video) => video.category === destination.category
  );

  const allDestinations = await getDestinations();
  const relatedDestinations = allDestinations
    .filter(
      (d) => d.id !== destination.id && d.category === destination.category
    )
    .slice(0, 4);

  const fallbackRelated =
    relatedDestinations.length < 3
      ? allDestinations
          .filter((d) => d.id !== destination.id && d.featured)
          .slice(0, 4 - relatedDestinations.length)
      : [];

  const finalRelated = [...relatedDestinations, ...fallbackRelated].slice(0, 4);

  const settings = getSettings();

  const attractionSchema = createTouristAttractionSchema(destination);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Destinasi", path: "/destinations" },
    { name: destination.name, path: `/destinations/${slug}`, },
  ]);

  return (
    <>
      <StructuredData data={attractionSchema} />
      <StructuredData data={breadcrumbSchema} />
      <DestinationDetailPageWrapper allDestinations={allDestinations}>
        <DestinationDetailContent
          destination={destination}
          videos={destinationVideos}
          relatedDestinations={finalRelated}
          whatsappPhone={settings.whatsapp}
        />
      </DestinationDetailPageWrapper>
    </>
  );
}
