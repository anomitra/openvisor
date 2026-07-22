import type { Metadata } from "next";
import Providers from "./Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenVisor — OpenCode Session Explorer",
  description:
    "Inspect your OpenCode sessions in detail. Messages, tool calls, reasoning, tokens, and cost — all in one place, entirely offline.",
  openGraph: {
    title: "OpenVisor — OpenCode Session Explorer",
    description:
      "Inspect your OpenCode sessions in detail. Messages, tool calls, reasoning, tokens, and cost — all in one place, entirely offline.",
    type: "website",
    url: "https://openvisor.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenVisor — OpenCode Session Explorer",
    description:
      "Inspect your OpenCode sessions in detail. Messages, tool calls, reasoning, tokens, and cost — all in one place, entirely offline.",
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
      </body>
    </html>
  );
}
