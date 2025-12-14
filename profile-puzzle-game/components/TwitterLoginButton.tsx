'use client';

import React from 'react';
import Image from 'next/image';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useSocialAccounts } from '@dynamic-labs/sdk-react-core';
import { ProviderEnum } from '@dynamic-labs/types';
import type { OAuthCredential } from '@/types/dynamic';
import { isOAuthCredential } from '@/types/dynamic';

const TwitterLoginButton: React.FC = () => {
  const { user, handleLogOut } = useDynamicContext();
  const { signInWithSocialAccount, isProcessing } = useSocialAccounts();

  const handleTwitterLogin = async () => {
    try {
      await signInWithSocialAccount(ProviderEnum.Twitter);
    } catch (error) {
      console.error('Twitter login error:', error);
    }
  };

  const handleLogout = async () => {
    if (handleLogOut) {
      await handleLogOut();
    }
  };

  // If user is logged in, show profile info
  if (user) {
    const twitterAccount = user.verifiedCredentials?.find(
      (cred) => isOAuthCredential(cred) && cred.oauthProvider === 'twitter'
    ) as OAuthCredential | undefined;

    const profileImage = twitterAccount?.oauthAccountPhotos?.[0] || 
                        twitterAccount?.oauthMetadata?.profile_image_url;
    const username = twitterAccount?.oauthUsername || 
                    twitterAccount?.oauthMetadata?.username || 
                    twitterAccount?.oauthDisplayName || 
                    user.username || 
                    'User';

    return (
      <div className="flex items-center gap-3">
        {profileImage && (
          <Image
            src={profileImage}
            alt="Profile"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full border-2 border-white/20"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm text-white/90 font-medium">@{username}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-white/60 hover:text-white/80 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Show login button when not authenticated
  return (
    <button
      onClick={handleTwitterLogin}
      disabled={isProcessing}
      className={`
        cursor-pointer rounded-full text-md font-semibold text-white shadow-primary-button 
        bg-[linear-gradient(90deg,#1DA1F2_3.81%,#0d8bd9_92.61%)] px-6 py-2 hover:opacity-90
        disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2
      `}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <span className="flex items-center gap-1">
        {isProcessing ? 'Connecting...' : (
          <>
            <span>Login</span>
          </>
        )}
      </span>
    </button>
  );
};

export default TwitterLoginButton;

