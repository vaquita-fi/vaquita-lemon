'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return null;
}
