import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Providers from "./Providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://openvisor.vercel.app"),
  title: "OpenVisor — OpenCode Session Explorer",
  description:
    "Inspect your OpenCode sessions in detail. Messages, tool calls, reasoning, tokens, and cost — all in one place.",
  openGraph: {
    title: "OpenVisor — OpenCode Session Explorer",
    description:
      "Inspect your OpenCode sessions in detail. Messages, tool calls, reasoning, tokens, and cost — all in one place.",
    type: "website",
    url: "https://openvisor.vercel.app",
    siteName: "OpenVisor",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpenVisor — OpenCode Session Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenVisor — OpenCode Session Explorer",
    description:
      "Inspect your OpenCode sessions in detail. Messages, tool calls, reasoning, tokens, and cost — all in one place.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-50 min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
