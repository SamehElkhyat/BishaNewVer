"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title = "غرفة بيشة التجارية | Bisha Chamber of Commerce",
  description = "غرفة بيشة التجارية - نمثل القطاع التجاري والصناعي في منطقة بيشة. نقدم خدمات الأعضاء، برنامج مزايا، فرص التوظيف، والاستشارات التجارية.",
  keywords = [],
  ogImage = "/bisha-chamber-logo.png",
  canonicalUrl,
}: SEOProps) {
  const pathname = usePathname();
  const baseUrl = "https://bishahcc.org";
  const fullUrl = `${baseUrl}${pathname || ""}`;
  const finalCanonical = canonicalUrl || fullUrl;

  const fullTitle = title.includes("غرفة بيشة")
    ? title
    : `${title} | غرفة بيشة التجارية`;

  /* =========================
     Structured Data
  ========================== */

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "غرفة بيشة التجارية",
    "alternateName": "Bisha Chamber of Commerce",
    "url": "https://bishahcc.org/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bishahcc.org/bisha-chamber-logo.png",
      "width": 512,
      "height": 512
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966-17-622-2222",
      "contactType": "customer service",
      "availableLanguage": ["ar", "en"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "King Fahd Road",
      "addressLocality": "Bisha",
      "addressRegion": "Asir",
      "postalCode": "61985",
      "addressCountry": "SA"
    },
    "sameAs": [
      "https://x.com/Bisha_cci",
      "https://www.instagram.com/bishahcc",
      "https://www.linkedin.com/company/bishahcc"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "غرفة بيشة التجارية",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  /* =========================
     Meta Tags
  ========================== */

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    /* Canonical */
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = finalCanonical;

    /* Basic */
    setMeta("name", "description", description);
    setMeta(
      "name",
      "keywords",
      [...new Set([...keywords, "غرفة بيشة", "Bisha Chamber", "بيشة"])].join(", ")
    );

    /* Open Graph */
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", `${baseUrl}${ogImage}`);
    setMeta("property", "og:url", finalCanonical);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "غرفة بيشة التجارية");
    setMeta("property", "og:locale", "ar_SA");

    /* Twitter */
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", `${baseUrl}${ogImage}`);
    setMeta("name", "twitter:site", "@Bisha_cci");

  }, [fullTitle, description, keywords, ogImage, finalCanonical]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
