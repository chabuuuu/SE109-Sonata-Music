"use client";
import React from "react";

const categories = [
  { title: "Podcasts", color: "bg-green-600", image: "/images/podcast.png" },
  { title: "Audiobooks", color: "bg-cyan-600", image: "/images/audiobook.png" },
  { title: "Made For You", color: "bg-blue-800", image: "/images/madeforyou.png" },
  { title: "Charts", color: "bg-purple-500", image: "/images/charts.png" },
  { title: "New Releases", color: "bg-pink-600", image: "/images/newrelease.png" },
  { title: "Discover", color: "bg-violet-400", image: "/images/discover.png" },
  { title: "Live Events", color: "bg-indigo-500", image: "/images/liveevents.png" },
  { title: "Hip-Hop", color: "bg-purple-300", image: "/images/hiphop.png" },
  { title: "Pop", color: "bg-pink-500", image: "/images/pop.png" },
  { title: "Country", color: "bg-cyan-200", image: "/images/country.png" },
  { title: "Latin", color: "bg-pink-400", image: "/images/latin.png" },
  { title: "Rock", color: "bg-lime-200", image: "/images/rock.png" },
  { title: "Summer", color: "bg-purple-300", image: "/images/summer.png" },
  { title: "Workout", color: "bg-gray-500", image: "/images/workout.png" },
  { title: "R&B", color: "bg-purple-600", image: "/images/rnb.png" },
];

const CategoriesPage: React.FC = () => {
  return (
    <main className="flex-1 p-8 bg-gray-100">
      {/* Section title (optional) */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Explore All</h2>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className={`${cat.color} relative aspect-square rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg`}
          >
            {/* Category name */}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-xl font-semibold text-white drop-shadow-md">
                {cat.title}
              </span>
            </div>

            {/* Decorative image */}
            <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 rotate-12">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-24 h-24 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default CategoriesPage;
