import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Ultimate Focus App",
    template: "%s | Ultimate Focus App",
  },
  description: "A comprehensive Pomodoro timer and productivity app built with Next.js, TypeScript, and Supabase. Features user authentication, cloud data sync, and advanced productivity tracking.",
  keywords: [
    "pomodoro timer",
    "productivity app",
    "focus timer",
    "task management",
    "time tracking",
    "productivity",
    "work from home",
    "concentration",
    "time management",
  ],
  authors: [
    {
      name: "Ultimate Focus App Team",
    },
  ],
  creator: "Ultimate Focus App Team",
  publisher: "Ultimate Focus App Team",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ultimatefocusapp.com",
    title: "Ultimate Focus App - Pomodoro Timer & Productivity Tracker",
    description: "Boost your productivity with our comprehensive Pomodoro timer and task management app. Track your focus sessions, manage projects, and achieve your goals.",
    siteName: "Ultimate Focus App",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ultimate Focus App - Pomodoro Timer & Productivity Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Focus App - Pomodoro Timer & Productivity Tracker",
    description: "Boost your productivity with our comprehensive Pomodoro timer and task management app.",
    images: ["/og-image.png"],
    creator: "@ultimatefocusapp",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "https://ultimatefocusapp.com",
  },
  verification: {
    google: "your-google-site-verification-code",
  },
  category: "productivity",
}; 