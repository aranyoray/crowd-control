import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrowdLeaf: Airport Crowd Simulator",
  description: "Biomimetic algorithm for adaptive crowd dispersal inspired by Mimosa pudica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
