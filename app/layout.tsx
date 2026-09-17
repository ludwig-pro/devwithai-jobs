import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jobs.devw.ai"),
  title: "Dev With AI · Jobs",
  description:
    "Board filtrable des opportunités partagées sur le Slack Dev With AI.",
  openGraph: {
    title: "Dev With AI · Jobs",
    description:
      "Board filtrable des opportunités partagées sur le Slack Dev With AI.",
    images: [{ url: "/og-home.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
