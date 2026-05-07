const BASE_URL = "https://inersiadev.cloud";

export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Inersia Dev",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logo.png`,
          width: 512,
          height: 512,
        },
        description:
          "We build scalable digital products and technology solutions tailored to your business needs — from strategy, design, to development.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Banyuwangi",
          addressRegion: "Jawa Timur",
          addressCountry: "ID",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["Indonesian", "English"],
        },
        sameAs: [
          "https://www.instagram.com/inersiadev",
          "https://www.linkedin.com/company/inersia-developer-indonesia",
        ],
      },

      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Inersia Dev",
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
        inLanguage: ["id-ID", "en-US"],
      },

      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/#webpage`,
        url: BASE_URL,
        name: "Inersia Dev — Digital Solutions for Growing Businesses",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
        description:
          "We build scalable digital products and technology solutions tailored to your business needs.",
        inLanguage: "id-ID",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: BASE_URL,
            },
          ],
        },
      },

      {
        "@type": "Service",
        "@id": `${BASE_URL}/#service`,
        provider: { "@id": `${BASE_URL}/#organization` },
        name: "Digital Product Development",
        description:
          "End-to-end digital product development including web applications, project management systems, and lead generation tools.",
        areaServed: {
          "@type": "Country",
          name: "Indonesia",
        },
        serviceType: "Software Development",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}