import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import type { Metadata } from "next";
import Provider from './provider';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "QA Autopilot – AI-Powered Test Automation",
  description: "Connect your GitHub repository, generate AI test cases, convert them to Playwright scripts, and run them in cloud browsers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignInUrl="/workspace" afterSignUpUrl="/workspace">
      <html lang="en" suppressHydrationWarning>
        <body style={{ margin: 0, padding: 0 }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Provider>
              {children}
            </Provider>
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
