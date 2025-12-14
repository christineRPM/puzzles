'use client';

import React, { useState, useMemo } from 'react';
import { PuzzleSize } from '@/types/puzzle';
import SlidingPuzzle from '@/components/SlidingPuzzle';
import { getRandomPuzzleImage } from '@/utils/puzzleImages';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import type { OAuthCredential } from '@/types/dynamic';
import { isOAuthCredential } from '@/types/dynamic';

export default function Home() {
  const [selectedSize, setSelectedSize] = useState<PuzzleSize>(3);
  const { user } = useDynamicContext();

  const selectedImage = useMemo(() => {
    if (user) {
      const twitterAccount = user.verifiedCredentials?.find(
        (cred) => isOAuthCredential(cred) && cred.oauthProvider === 'twitter'
      ) as OAuthCredential | undefined;
      
      const profileImage = twitterAccount?.oauthAccountPhotos?.[0] || 
                          twitterAccount?.oauthMetadata?.profile_image_url;
      
      if (profileImage) {
        const largerImage = profileImage
          .replace(/_normal\.(jpg|png|webp)$/i, '_400x400.$1')
          .replace(/_bigger\.(jpg|png|webp)$/i, '_400x400.$1')
          .replace(/_mini\.(jpg|png|webp)$/i, '_400x400.$1');
        
        return largerImage;
      }
    }
    return getRandomPuzzleImage();
  }, [user]);

  const handleSizeChange = (size: PuzzleSize) => {
    setSelectedSize(size);
  };

  return (
    <main className="min-h-screen py-8">
      <SlidingPuzzle 
        size={selectedSize} 
        imageUrl={selectedImage}
        onSizeChange={handleSizeChange}
      />
    </main>
  );
}