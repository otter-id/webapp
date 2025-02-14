import type { Metadata } from "next";
import { roboto } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Otter Receipt System",
  description: "Otter Receipt System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
}
