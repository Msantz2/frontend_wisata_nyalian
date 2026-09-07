import fs from "fs";
import path from "path";

interface Destination {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  location: {
    village: string;
    district: string;
    regency: string;
    province: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  images: string[];
  videos?: string[];
  facilities: string[];
  operatingHours: {
    open: string;
    close: string;
  };
  ticketPrice: {
    adult: number;
    child: number;
  };
  rating?: number;
  totalReviews?: number;
  featured: boolean;
}

interface TourPackage {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  gallery: string[];
  price: number;
  duration: string;
  capacity: string;
  highlights: string[];
  itinerary: string[];
  included: string[];
  excluded: string[];
  destinations: string[];
  rating?: number;
  featured: boolean;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
}

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  featured: boolean;
  order: number;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  category: string;
}

interface ValidationError {
  file: string;
  issue: string;
  details: string;
}

const errors: ValidationError[] = [];
const warnings: ValidationError[] = [];

function validateJSON(filePath: string): unknown {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    errors.push({
      file: filePath,
      issue: "Invalid JSON",
      details: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function validateImagePath(imagePath: string, context: string): void {
  const fullPath = path.join(process.cwd(), "public", imagePath);
  if (!fs.existsSync(fullPath)) {
    warnings.push({
      file: context,
      issue: "Missing image file",
      details: `Image not found: ${imagePath}`,
    });
  }
}

function validateDestinations(data: Destination[]): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  data.forEach((dest, index) => {
    const context = `destinations.json[${index}]`;

    if (!dest.id || !dest.slug || !dest.name) {
      errors.push({
        file: context,
        issue: "Missing required fields",
        details: `id: ${dest.id}, slug: ${dest.slug}, name: ${dest.name}`,
      });
    }

    if (ids.has(dest.id)) {
      errors.push({
        file: context,
        issue: "Duplicate ID",
        details: `ID "${dest.id}" already exists`,
      });
    }
    ids.add(dest.id);

    if (slugs.has(dest.slug)) {
      errors.push({
        file: context,
        issue: "Duplicate slug",
        details: `Slug "${dest.slug}" already exists`,
      });
    }
    slugs.add(dest.slug);

    dest.images.forEach((img) => validateImagePath(img, context));
  });
}

function validatePackages(data: TourPackage[], destinationIds: string[]): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  data.forEach((pkg, index) => {
    const context = `packages.json[${index}]`;

    if (!pkg.id || !pkg.slug || !pkg.name) {
      errors.push({
        file: context,
        issue: "Missing required fields",
        details: `id: ${pkg.id}, slug: ${pkg.slug}, name: ${pkg.name}`,
      });
    }

    if (ids.has(pkg.id)) {
      errors.push({
        file: context,
        issue: "Duplicate ID",
        details: `ID "${pkg.id}" already exists`,
      });
    }
    ids.add(pkg.id);

    if (slugs.has(pkg.slug)) {
      errors.push({
        file: context,
        issue: "Duplicate slug",
        details: `Slug "${pkg.slug}" already exists`,
      });
    }
    slugs.add(pkg.slug);

    pkg.gallery.forEach((img) => validateImagePath(img, context));

    pkg.destinations.forEach((destId) => {
      if (!destinationIds.includes(destId)) {
        errors.push({
          file: context,
          issue: "Broken reference",
          details: `Referenced destination ID "${destId}" does not exist`,
        });
      }
    });
  });
}

function validateArticles(data: Article[]): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  data.forEach((article, index) => {
    const context = `articles.json[${index}]`;

    if (!article.id || !article.slug || !article.title) {
      errors.push({
        file: context,
        issue: "Missing required fields",
        details: `id: ${article.id}, slug: ${article.slug}, title: ${article.title}`,
      });
    }

    if (ids.has(article.id)) {
      errors.push({
        file: context,
        issue: "Duplicate ID",
        details: `ID "${article.id}" already exists`,
      });
    }
    ids.add(article.id);

    if (slugs.has(article.slug)) {
      errors.push({
        file: context,
        issue: "Duplicate slug",
        details: `Slug "${article.slug}" already exists`,
      });
    }
    slugs.add(article.slug);

    validateImagePath(article.coverImage, context);
  });
}

function validateFAQs(data: FAQ[]): void {
  const ids = new Set<string>();

  data.forEach((faq, index) => {
    const context = `faq.json[${index}]`;

    if (!faq.id || !faq.question || !faq.answer) {
      errors.push({
        file: context,
        issue: "Missing required fields",
        details: `id: ${faq.id}, question: ${!!faq.question}, answer: ${!!faq.answer}`,
      });
    }

    if (ids.has(faq.id)) {
      errors.push({
        file: context,
        issue: "Duplicate ID",
        details: `ID "${faq.id}" already exists`,
      });
    }
    ids.add(faq.id);
  });
}

function validateVideos(data: Video[]): void {
  const ids = new Set<string>();

  data.forEach((video, index) => {
    const context = `videos.json[${index}]`;

    if (!video.id || !video.title || !video.youtubeId) {
      errors.push({
        file: context,
        issue: "Missing required fields",
        details: `id: ${video.id}, title: ${video.title}, youtubeId: ${video.youtubeId}`,
      });
    }

    if (ids.has(video.id)) {
      errors.push({
        file: context,
        issue: "Duplicate ID",
        details: `ID "${video.id}" already exists`,
      });
    }
    ids.add(video.id);

    validateImagePath(video.thumbnail, context);
  });
}

console.log("🔍 Validating data files...\n");

const dataDir = path.join(process.cwd(), "data");

const destinations = validateJSON(path.join(dataDir, "destinations.json"));
if (destinations && isArray(destinations)) {
  console.log(`✓ destinations.json: ${destinations.length} entries`);
  validateDestinations(destinations as Destination[]);
}

const packages = validateJSON(path.join(dataDir, "packages.json"));
if (packages && isArray(packages)) {
  console.log(`✓ packages.json: ${packages.length} entries`);
  const destinationIds = destinations && isArray(destinations) ? (destinations as Destination[]).map((d) => d.id) : [];
  validatePackages(packages as TourPackage[], destinationIds);
}

const articles = validateJSON(path.join(dataDir, "articles.json"));
if (articles && isArray(articles)) {
  console.log(`✓ articles.json: ${articles.length} entries`);
  validateArticles(articles as Article[]);
}

const faqs = validateJSON(path.join(dataDir, "faq.json"));
if (faqs && isArray(faqs)) {
  console.log(`✓ faq.json: ${faqs.length} entries`);
  validateFAQs(faqs as FAQ[]);
}

const videos = validateJSON(path.join(dataDir, "videos.json"));
if (videos && isArray(videos)) {
  console.log(`✓ videos.json: ${videos.length} entries`);
  validateVideos(videos as Video[]);
}

console.log("\n" + "=".repeat(60));

if (errors.length > 0) {
  console.log(`\n❌ ${errors.length} ERROR(S) FOUND:\n`);
  errors.forEach((err) => {
    console.log(`  File: ${err.file}`);
    console.log(`  Issue: ${err.issue}`);
    console.log(`  Details: ${err.details}\n`);
  });
}

if (warnings.length > 0) {
  console.log(`\n⚠️  ${warnings.length} WARNING(S) FOUND:\n`);
  warnings.forEach((warn) => {
    console.log(`  File: ${warn.file}`);
    console.log(`  Issue: ${warn.issue}`);
    console.log(`  Details: ${warn.details}\n`);
  });
}

if (errors.length === 0 && warnings.length === 0) {
  console.log("\n✅ All data files validated successfully!");
  console.log("No errors or warnings found.\n");
  process.exit(0);
} else {
  console.log("=".repeat(60) + "\n");
  if (errors.length > 0) {
    console.log("❌ Validation failed. Please fix the errors above.");
    process.exit(1);
  } else {
    console.log("⚠️  Validation passed with warnings. Review warnings above.");
    process.exit(0);
  }
}
