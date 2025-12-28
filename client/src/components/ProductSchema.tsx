import { useEffect } from "react";

/**
 * ProductSchema Component
 * 
 * Adds JSON-LD structured data to product pages for rich snippets in Google search results.
 * Enables display of:
 * - Star ratings
 * - Price and currency
 * - Availability status
 * - Customer reviews
 * - Product images
 * - Brand information
 * 
 * Reference: https://schema.org/Product
 */

interface Review {
  author: string;
  datePublished: string;
  reviewBody: string;
  reviewRating: number;
}

interface ProductSchemaProps {
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Product image URL (full URL including domain) */
  image: string;
  /** Additional product images (gallery) */
  additionalImages?: string[];
  /** Product SKU or ID */
  sku: string;
  /** Brand name */
  brand?: string;
  /** Price in cents */
  priceInCents: number;
  /** Currency code (default: USD) */
  currency?: string;
  /** Availability status */
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued";
  /** Product URL (full URL including domain) */
  url: string;
  /** Aggregate rating value (e.g., 4.8) */
  ratingValue?: number;
  /** Number of ratings */
  ratingCount?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Sample reviews to display */
  reviews?: Review[];
}

export default function ProductSchema({
  name,
  description,
  image,
  sku,
  brand = "Optibio",
  priceInCents,
  currency = "USD",
  availability = "InStock",
  url,
  ratingValue = 4.9,
  ratingCount = 2847,
  reviewCount = 2847,
  reviews = [],
  additionalImages = [],
}: ProductSchemaProps) {
  useEffect(() => {
    // Create the schema object
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name,
      description,
      image: additionalImages.length > 0 ? [image, ...additionalImages] : image,
      sku,
      brand: {
        "@type": "Brand",
        name: brand,
      },
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: currency,
        price: (priceInCents / 100).toFixed(2),
        availability: `https://schema.org/${availability}`,
        priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
        seller: {
          "@type": "Organization",
          name: brand,
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: ratingValue.toString(),
        bestRating: "5",
        worstRating: "1",
        ratingCount: ratingCount.toString(),
        reviewCount: reviewCount.toString(),
      },
    };

    // Add reviews if provided
    if (reviews.length > 0) {
      (schema as any).review = reviews.map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.author,
        },
        datePublished: review.datePublished,
        reviewBody: review.reviewBody,
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.reviewRating.toString(),
          bestRating: "5",
          worstRating: "1",
        },
      }));
    }

    // Create script element
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.id = "product-schema";

    // Remove existing schema if present
    const existingSchema = document.getElementById("product-schema");
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add to document head
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const schemaToRemove = document.getElementById("product-schema");
      if (schemaToRemove) {
        schemaToRemove.remove();
      }
    };
  }, [
    name,
    description,
    image,
    sku,
    brand,
    priceInCents,
    currency,
    availability,
    url,
    ratingValue,
    ratingCount,
    reviewCount,
    reviews,
    additionalImages,
  ]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Example Usage:
 * 
 * <ProductSchema
 *   name="Optibio Ashwagandha KSM-66"
 *   description="Premium full-spectrum Ashwagandha root extract with clinically-studied KSM-66®"
 *   image="https://optibiosupplements.com/products/ashwagandha-bottle.jpg"
 *   sku="OPTIBIO-ASH-90"
 *   brand="Optibio"
 *   priceInCents={4999}
 *   currency="USD"
 *   availability="InStock"
 *   url="https://optibiosupplements.com/product/ashwagandha-ksm-66"
 *   ratingValue={4.9}
 *   ratingCount={2847}
 *   reviewCount={2847}
 *   reviews={[
 *     {
 *       author: "Rachel K.",
 *       datePublished: "2025-11-15",
 *       reviewBody: "I used to dread Mondays...",
 *       reviewRating: 5,
 *     },
 *   ]}
 * />
 */
