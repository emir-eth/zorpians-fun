import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zorpian Abduction Protocol — Community Experience",
  description:
    "A community-made interactive abduction experience inspired by Zorpians. Not affiliated with or endorsed by Zorpians.",
  openGraph: {
    title: "Zorpian Abduction Protocol",
    description: "Planet Zorp is scanning Earth. Identify yourself.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--zorp-black)] antialiased">
        {children}
      </body>
    </html>
  );
}
