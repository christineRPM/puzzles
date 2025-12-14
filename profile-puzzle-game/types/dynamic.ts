// Type definitions for Dynamic Labs SDK

export interface OAuthMetadata {
  profile_image_url?: string;
  username?: string;
  [key: string]: unknown;
}

export interface OAuthCredential {
  format: string;
  oauthProvider?: string;
  oauthUsername?: string;
  oauthDisplayName?: string | null;
  oauthAccountPhotos?: string[];
  oauthMetadata?: OAuthMetadata;
  [key: string]: unknown;
}

// Type guard to check if a credential is an OAuth credential
export function isOAuthCredential(cred: unknown): cred is OAuthCredential {
  return (
    typeof cred === 'object' &&
    cred !== null &&
    'format' in cred &&
    (cred as OAuthCredential).format === 'oauth'
  );
}

