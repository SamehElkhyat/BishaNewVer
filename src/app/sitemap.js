export default function sitemap() {
  const baseUrl = "https://bishahcc.org";

  const routes = [
    "",
    "/about/vision",
    "/about/board",
    "/about/secretariat",
    "/about/general-assembly",
    "/about/committees",
    "/about/regulations",
    "/about/annual-reports",
    "/about/studies",
    "/about/surveys",
    "/about/trade-bulletins",
    "/about/e-library",
    "/services",
    "/initiatives",
    "/activities",
    "/circulars",
    "/media-center",
    "/media-center/news",
    "/media-center/circulars",
    "/contact",
    "/job-application",
    "/mazaya-application",
    "/membership-card",
    "/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}
