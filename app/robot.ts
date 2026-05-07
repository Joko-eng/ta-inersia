import { MetadataRoute } from "next";

const BASE_URL = "https://inersiadev.cloud";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/monitoring"],
        disallow: [
          "/dashboard/",
          "/login",
          "/unauthorized",
          "/proyek-member/",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}