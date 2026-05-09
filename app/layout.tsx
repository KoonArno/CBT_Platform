import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import { MuiProvider } from "@/components/providers/MuiProvider";

export const metadata: Metadata = {
  title: "CBT Supinsight — CTS-R Review Assistant",
  description:
    "AI-augmented supervisor workflow for evaluating CTS-R from CBT session transcripts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <MuiProvider>
          <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
            <AppSidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </MuiProvider>
      </body>
    </html>
  );
}
