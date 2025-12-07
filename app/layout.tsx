// import "./theme.css";
// import "@coinbase/onchainkit/styles.css";
import { AuthButtons, Providers } from '@/components';
import { GlobalLoader, WithHydrated } from '@/core-ui/components';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import Image from 'next/image';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  return {
    title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
    description: 'La forma más segura y divertida de generar ahorros con el poder de la blockchain',
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        button: {
          title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}`,
          action: {
            type: 'launch_frame',
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <WithHydrated>
          <Providers>
            <div className="h-14 shrink-0 flex justify-between bg-primary">
              {/* show the logo just mobile and tablet */}
              <div className="md:hidden">
                <Image src="/vaquita/vaquita_logo.png" alt="Vaquita" width={180} height={180} />
              </div>
              <AuthButtons />
            </div>
            <main className="flex-1 min-h-0 overflow-auto">{children}</main>
          </Providers>
        </WithHydrated>
        <GlobalLoader />
      </body>
    </html>
  );
}
