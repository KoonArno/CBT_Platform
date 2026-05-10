import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { MuiProvider } from "@/components/providers/MuiProvider";
import { AuthProvider } from "@/lib/auth-context";
import { AuthGate } from "@/components/AuthGate";

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
          <AuthProvider>
            <AuthGate>{children}</AuthGate>
          </AuthProvider>
        </MuiProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              "!rounded-lg !border !border-border !bg-card !text-foreground !shadow-lg",
          }}
        />
      </body>
    </html>
  );
}
