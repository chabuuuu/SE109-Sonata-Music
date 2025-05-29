"use client";

import React, { useState } from 'react';
import { Heart, Music, User, Disc } from 'lucide-react';
import Navbar from '@/components/navbar';
import FavoriteSongs from './songs/page';
import FavoriteArtists from './artists/page';
import FavoriteAlbums from './albums/page';

const MyFavoritesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'songs' | 'artists' | 'albums'>('songs');

  const tabs = [
    { key: 'songs', label: 'Songs', icon: Music },
    { key: 'artists', label: 'Artists', icon: User },
    { key: 'albums', label: 'Albums', icon: Disc }
  ] as const;

  return (
    <div className="flex h-screen bg-[#F8F0E3] text-[#3A2A24] font-['Playfair_Display',serif]">
      {/* Sidebar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C8A97E] to-[#A67C52] text-white px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-['Playfair_Display',serif]">
                My Favorites
              </h1>
              <p className="text-white/90 text-lg">
                Bộ sưu tập yêu thích của bạn
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-white text-[#C8A97E] shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'songs' && <FavoriteSongs />}
          {activeTab === 'artists' && <FavoriteArtists />}
          {activeTab === 'albums' && <FavoriteAlbums />}
        </div>
      </main>
    </div>
  );
};

export default MyFavoritesPage; 