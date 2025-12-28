import { useEffect } from "react";

/**
 * FAQSchema Component
 * 
 * Adds JSON-LD structured data for FAQ pages to enable rich snippets in Google search results.
 * Displays FAQ accordion directly in search results.
 * 
 * Reference: https://schema.org/FAQPage
 */

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  /** Array of FAQ items */
  faqs: FAQItem[];
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  useEffect(() => {
    // Create the schema object
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };

    // Create script element
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.id = "faq-schema";

    // Remove existing schema if present
    const existingSchema = document.getElementById("faq-schema");
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add to document head
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const schemaToRemove = document.getElementById("faq-schema");
      if (schemaToRemove) {
        schemaToRemove.remove();
      }
    };
  }, [faqs]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Example Usage:
 * 
 * <FAQSchema
 *   faqs={[
 *     {
 *       question: "What is KSM-66 Ashwagandha?",
 *       answer: "KSM-66 is the most clinically studied ashwagandha extract..."
 *     },
 *     {
 *       question: "How long does shipping take?",
 *       answer: "Orders ship within 1-2 business days..."
 *     }
 *   ]}
 * />
 */
