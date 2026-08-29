// src/app/layout.js
import "./globals.css";
import VideoBackground from "../components/VideoBackground";
import { AuthProvider } from "../contexts/AuthContext";
import SEO from "../components/SEO";
import localFont from 'next/font/local';

const PRIMARY_COLOR = "#003366";
const SITE_URL = "https://bishahcc.org";
const SITE_NAME = "غرفة بيشة التجارية";
const SITE_DESCRIPTION =
  "غرفة بيشة التجارية - نمثل القطاع التجاري والصناعي في منطقة بيشة. نقدم خدمات الأعضاء، برنامج مزايا، فرص التوظيف، والاستشارات التجارية.";

// Local Tajawal font configuration
const tajawal = localFont({
  src: [
    {
      path: '../../public/fonts/Tajawal-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Tajawal-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-tajawal',
  display: 'swap',
});

export const viewport = {
  themeColor: PRIMARY_COLOR,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/bisha-chamber-logo.png`,
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/bisha-chamber-logo.png`],
    site: "@Bisha_cci",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} font-sans`}>
      <head>
        {/* Viewport is now handled by the viewport export */}

        {/* Canonical */}
        <link rel="canonical" href={SITE_URL} />

        {/* Favicons */}
        <link rel="icon" href="/bisha-chamber-logo.png" type="image/png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/bisha-chamber-logo.png"
        />
        <link rel="shortcut icon" href="/bisha-chamber-logo.png" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="غرفة بيشة التجارية"
        />
      </head>

      <body className="antialiased">
        {/* SEO + Structured Data (Organization & Website) */}
        <SEO />

        <VideoBackground />

        <div style={{ position: "relative", zIndex: 1 }}>
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
