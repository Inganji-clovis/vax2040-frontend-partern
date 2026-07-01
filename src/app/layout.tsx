import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAX2040 Curator Workstation",
  description: "Internal administrative control center for VAX2040 collaborative overrides and data scraping audits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
