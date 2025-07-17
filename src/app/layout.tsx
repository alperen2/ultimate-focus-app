import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientAuthProvider from "@/components/ClientAuthProvider";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
export { metadata } from "./metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ClientAuthProvider>
            {children}
          </ClientAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
