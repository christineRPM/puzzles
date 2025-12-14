'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PuzzleSize } from '@/types/puzzle';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import type { OAuthCredential } from '@/types/dynamic';
import { isOAuthCredential } from '@/types/dynamic';

interface PuzzleControlsProps {
  moves: number;
  time: string;
  isComplete: boolean;
  isShuffled: boolean;
  selectedSize: PuzzleSize;
  onSizeChange: (size: PuzzleSize) => void;
  progress: number;
}

const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  moves,
  time,
  isComplete,
  isShuffled,
  selectedSize,
  onSizeChange,
  progress,
}) => {
  const { user, primaryWallet } = useDynamicContext();
  const [isOpen, setIsOpen] = useState(true);
  const [mobileIsOpen, setMobileIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const startY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const puzzleSizes: PuzzleSize[] = [3, 4, 5, 6];

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    currentY.current = e.touches[0].clientY;
    
    const diff = currentY.current - startY.current;
    
    if ((diff > 0 && mobileIsOpen) || (diff < 0 && !mobileIsOpen)) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (startY.current === null || currentY.current === null) return;
    
    const diff = currentY.current - startY.current;
    const threshold = 50;
    
    if (diff < -threshold && !mobileIsOpen) {
      setMobileIsOpen(true);
    }
    
    if (diff > threshold && mobileIsOpen) {
      setMobileIsOpen(false);
    }
    
    startY.current = null;
    currentY.current = null;
  };

  // Add event listener to collapse mobile dashboard when clicking outside
  useEffect(() => {
    const handleCanvasClick = (e: MouseEvent) => {
      if (mobileSheetRef.current && !mobileSheetRef.current.contains(e.target as Node)) {
        setMobileIsOpen(false);
      }
    };

    document.addEventListener('click', handleCanvasClick);
    return () => {
      document.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <>
      {/* Desktop Dashboard Panel */}
      <div 
        className={`hidden md:block fixed top-0 left-0 h-full z-20 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-[320px]' : 'w-[60px]'
        }`}
      >
        {/* Mini Sidebar When Collapsed */}
        {!isOpen && (
          <div className="h-full w-[60px] bg-[#0a0a0a]/95 backdrop-blur-md border-r border-gray-800/50 shadow-2xl flex flex-col items-center justify-center">
            {/* Centered Content */}
            <div className="flex flex-col items-center gap-8">
              {/* Dashboard Label */}
              <div 
                className="text-gray-400 text-xs font-semibold transform -rotate-90 whitespace-nowrap cursor-pointer hover:text-white transition-colors"
                onClick={() => setIsOpen(true)}
              >
                Dashboard
              </div>
              
              {/* Collapse Button - Centered */}
              <button
                className="bg-[#0a0a0a]/95 backdrop-blur-md hover:bg-gray-800/50 p-2 rounded-lg border border-gray-800/50 shadow-lg flex items-center justify-center transition-all duration-200 group"
                onClick={() => setIsOpen(true)}
              >
                <svg className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className={`h-full bg-[#0a0a0a]/95 backdrop-blur-md border-r border-gray-800/50 shadow-2xl transition-all duration-300 ${
          isOpen ? 'w-[320px]' : 'w-0 overflow-hidden'
        }`}>
          <div className="p-0 overflow-y-auto flex flex-col h-full">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between p-6">
              <div className="flex-1 mr-4">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Dashboard
                </h2>
                <p className="text-gray-400 text-sm">
                  Game Statistics & Controls
                </p>
              </div>
              <button
                className="bg-[#0a0a0a]/95 backdrop-blur-md hover:bg-gray-800/50 p-2 rounded-lg border border-gray-800/50 transition-all duration-200 group"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <div className="border-t border-gray-800/50" />

            {/* Game Stats Section */}
            <div className="p-6 space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Moves</p>
                  <p className="text-2xl font-semibold text-[#3CA3FC]">
                    {moves}
                  </p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Time</p>
                  <p className="text-2xl font-mono font-semibold text-[#3CA3FC] tabular-nums">
                    {time}
                  </p>
                </div>
              </div>

              {/* Game Status */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400">Game Status</p>
                <p className="text-lg font-semibold text-white mb-3">
                  {isComplete ? '🎉 Complete!' : isShuffled ? 'In Progress' : 'Ready to Start'}
                </p>
                
                {/* User Profile Info */}
                {user && (
                  <div className="border-t border-gray-700 pt-3">
                    <p className="text-sm text-gray-400 mb-2">User Profile</p>
                    <div className="space-y-2 text-xs">
                      {(() => {
                        const twitterAccount = user.verifiedCredentials?.find(
                          (cred) => isOAuthCredential(cred) && cred.oauthProvider === 'twitter'
                        ) as OAuthCredential | undefined;
                        const profileImage = twitterAccount?.oauthAccountPhotos?.[0] || 
                                           twitterAccount?.oauthMetadata?.profile_image_url;
                        const username = twitterAccount?.oauthUsername || 
                                       twitterAccount?.oauthMetadata?.username || 
                                       twitterAccount?.oauthDisplayName || 
                                       user.username;
                        
                        return (
                          <>
                            {profileImage && (
                              <div className="flex items-center gap-2">
                                <Image
                                  src={profileImage}
                                  alt="Profile"
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 rounded-full border border-gray-600"
                                />
                                <span className="text-gray-300">@{username || 'User'}</span>
                              </div>
                            )}
                            {primaryWallet && (
                              <button
                                onClick={() => handleCopyAddress(primaryWallet.address)}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
                                title="Click to copy full address"
                              >
                                <div className="w-2 h-2 bg-[#3CA3FC] rounded-full"></div>
                                <span className="text-gray-300 font-mono text-[10px]">
                                  {copied ? 'Copied!' : `${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`}
                                </span>
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Progress</p>
                  <p className="text-sm text-white">{Math.round(progress)}%</p>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#44D5DE] to-[#3CA3FC] transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Puzzle Size Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Puzzle Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  {puzzleSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => onSizeChange(size)}
                      disabled={isShuffled && !isComplete}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-200 font-semibold text-sm
                        ${selectedSize === size
                          ? 'border-[#3CA3FC] bg-[#3CA3FC]/20 text-white'
                          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                        }
                        ${isShuffled && !isComplete ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="text-lg font-bold">{size}×{size}</div>
                      <div className="text-xs">
                        {size === 3 && 'Easy'}
                        {size === 4 && 'Medium'}
                        {size === 5 && 'Hard'}
                        {size === 6 && 'Expert'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet Dashboard */}
      <div 
        ref={mobileSheetRef}
        className={`md:hidden fixed bottom-0 left-0 right-0 z-20 transition-transform duration-300 ease-in-out touch-none ${
          mobileIsOpen ? 'translate-y-0' : 'translate-y-[calc(100%-55px)]'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="rounded-t-xl bg-[#0a0a0a]/95 backdrop-blur-md border-t border-x border-gray-800/50 max-h-[80vh] overflow-hidden">
          {/* Drag Handle */}
          <div 
            className="h-8 flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setMobileIsOpen(!mobileIsOpen);
            }}
          >
            <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>
            <div className="absolute top-2 right-3 px-2 py-1 rounded-full bg-[#0a0a0a]/70 backdrop-blur-sm border border-gray-800/50">
              <span className="text-xs font-medium text-[#3CA3FC]">
                Built by christineRPM
              </span>
            </div>
          </div>
          
          {/* Mobile Dashboard Header */}
          <div className="px-4 pb-2 text-center relative">
            <div>
              <p className="text-gray-400 text-xs mb-1">
                Game Statistics & Controls
              </p>
              <h2 className="text-lg font-semibold text-white">
                Profile Puzzle Dashboard
              </h2>
            </div>
          </div>

          <div className="border-t border-gray-800/50" />
          
          {/* Mobile Dashboard Content */}
          <div className="overflow-y-auto p-0">
            <div className="px-4 py-3 space-y-3 bg-gray-800/20">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-gray-400">Moves</p>
                  <p className="text-base font-semibold text-[#3CA3FC]">
                    {moves}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Time</p>
                  <p className="text-base font-mono font-semibold text-[#3CA3FC] tabular-nums">
                    {time}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-base font-semibold text-white">
                    {isComplete ? 'Complete!' : isShuffled ? 'In Progress' : 'Ready'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Progress</p>
                  <p className="text-base font-semibold text-white">
                    {Math.round(progress)}%
                  </p>
                </div>
              </div>

              {/* Mobile Game Status */}
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-white">Game Status</h3>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-sm font-semibold text-white mb-2">
                    {isComplete ? '🎉 Complete!' : isShuffled ? 'In Progress' : 'Ready'}
                  </p>
                  
                  {/* Mobile User Profile Info */}
                  {user && (
                    <div className="border-t border-gray-700 pt-2">
                      <p className="text-xs text-gray-400 mb-1">User Profile</p>
                      <div className="space-y-1 text-xs">
                          {(() => {
                          const twitterAccount = user.verifiedCredentials?.find(
                            (cred) => isOAuthCredential(cred) && cred.oauthProvider === 'twitter'
                          ) as OAuthCredential | undefined;
                          const profileImage = twitterAccount?.oauthAccountPhotos?.[0] || 
                                             twitterAccount?.oauthMetadata?.profile_image_url;
                          const username = twitterAccount?.oauthUsername || 
                                         twitterAccount?.oauthMetadata?.username || 
                                         twitterAccount?.oauthDisplayName || 
                                         user.username;
                          
                          return (
                            <>
                              {profileImage && (
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={profileImage}
                                    alt="Profile"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 rounded-full border border-gray-600"
                                  />
                                  <span className="text-gray-300 text-xs">@{username || 'User'}</span>
                                </div>
                              )}
                              {primaryWallet && (
                                <button
                                  onClick={() => handleCopyAddress(primaryWallet.address)}
                                  className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
                                  title="Click to copy full address"
                                >
                                  <div className="w-1.5 h-1.5 bg-[#3CA3FC] rounded-full"></div>
                                  <span className="text-gray-300 text-[10px] font-mono">
                                    {copied ? 'Copied!' : `${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`}
                                  </span>
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Puzzle Size Selection */}
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-white">Puzzle Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {puzzleSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => onSizeChange(size)}
                      disabled={isShuffled && !isComplete}
                      className={`
                        p-2 rounded-lg border-2 transition-all duration-200 font-semibold text-xs
                        ${selectedSize === size
                          ? 'border-[#3CA3FC] bg-[#3CA3FC]/20 text-white'
                          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                        }
                        ${isShuffled && !isComplete ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {size}×{size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PuzzleControls; 