"use client";
import React, { useState, useEffect } from "react";
import {
  Gift,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Plus,
  Minus,
} from "lucide-react";
import ContributorLayout from "@/components/contributor-layout";
import axios from "axios";
import { CONTRIBUTOR_TOKEN } from "@/constant/contributorToken";

export default function ExchangePremiumPage() {
  const [username, setUsername] = useState("");
  const [pointsToExchange, setPointsToExchange] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeStatus, setExchangeStatus] = useState(""); // 'success' | 'error' | null

  // User data - replace with actual API data
  const [userPoints, setUserPoints] = useState(0); // Current user points

  // Handle increment points (can't exceed userPoints)
  const handleIncrement = () => {
    setPointsToExchange((prev) => {
      const newValue = prev + 10;
      return newValue <= userPoints ? newValue : prev;
    });
  };

  // Handle decrement points (can't go below 0)
  const handleDecrement = () => {
    setPointsToExchange((prev) => {
      const newValue = prev - 10;
      return newValue >= 0 ? newValue : 0;
    });
  };

  const handleExchange = async () => {
    if (!username.trim()) {
      setExchangeStatus("error");
      return;
    }

    const response = await axios.post(
      "https://api.sonata.io.vn/api/v1/contributor/exchange-premium",
      {
        listenerUsername: username,
        pointsExchange: pointsToExchange,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(CONTRIBUTOR_TOKEN)}`,
        },
      }
    );

    setIsLoading(true);
    setExchangeStatus("null");

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setExchangeStatus("success");
      // Deduct points after successful exchange
      setUserPoints((prev) => prev - pointsToExchange);
      // Reset form after successful exchange
      setTimeout(() => {
        setUsername("");
        setPointsToExchange(0);
        setExchangeStatus("null");
      }, 3000);
    }, 2000);
  };

  useEffect(() => {
    const fetchContributorPoints = async () => {
      try {
        const response = await axios.get(
          "https://api.sonata.io.vn/api/v1/contributor/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                CONTRIBUTOR_TOKEN
              )}`,
            },
          }
        );
        setUserPoints(response.data.data.points);
      } catch (err) {
        console.log("Can't fetch contributor points.", err);
      }
    };
    fetchContributorPoints();
  }, []);

  return (
    <ContributorLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Main Content */}
        <div className="max-w-lg mx-auto px-6 py-12">
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white mb-1">
                Exchange Premium
              </h1>
              <p className="text-blue-100 text-sm">
                Convert points to premium access
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Exchange Rate */}
              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-700/20">
                <div className="flex items-center justify-between text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">10</div>
                    <div className="text-xs text-blue-300">Points</div>
                  </div>
                  <div className="text-blue-300 text-sm">=</div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">15</div>
                    <div className="text-xs text-blue-300">Days Premium</div>
                  </div>
                </div>
              </div>

              {/* Current Points */}
              <div className="bg-blue-900/15 rounded-xl p-4 border border-blue-700/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Available Points</div>
                      <div className="text-blue-300 text-xs">Ready to exchange</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-400">{userPoints}</div>
                  </div>
                </div>
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Listener Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>

              {/* Points Selection */}
              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Points to Exchange
                </label>
                <div className="bg-blue-900/15 rounded-xl p-4 border border-blue-700/20">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleDecrement}
                      disabled={pointsToExchange <= 0 || isLoading}
                      className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 disabled:bg-gray-500/10 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all duration-200 border border-red-500/20 disabled:border-gray-500/20"
                    >
                      <Minus className={`w-4 h-4 ${pointsToExchange <= 0 ? "text-gray-400" : "text-red-400"}`} />
                    </button>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{pointsToExchange}</div>
                      <div className="text-xs text-blue-300">points</div>
                    </div>

                    <button
                      onClick={handleIncrement}
                      disabled={pointsToExchange >= userPoints || isLoading}
                      className="w-10 h-10 bg-green-500/10 hover:bg-green-500/20 disabled:bg-gray-500/10 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all duration-200 border border-green-500/20 disabled:border-gray-500/20"
                    >
                      <Plus className={`w-4 h-4 ${pointsToExchange >= userPoints ? "text-gray-400" : "text-green-400"}`} />
                    </button>
                  </div>

                  {/* Preview */}
                  {pointsToExchange > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-700/20">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">Premium days:</span>
                        <span className="text-yellow-400 font-medium">
                          {Math.floor(pointsToExchange / 10) * 15} days
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Exchange Button */}
              <button
                onClick={handleExchange}
                disabled={
                  isLoading ||
                  !username.trim() ||
                  pointsToExchange <= 0 ||
                  userPoints < pointsToExchange
                }
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    Exchange Premium
                  </>
                )}
              </button>

              {/* Insufficient Points Warning */}
              {userPoints < pointsToExchange && pointsToExchange > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 font-medium text-sm">Insufficient Points</p>
                    <p className="text-yellow-400 text-xs">
                      Need {pointsToExchange - userPoints} more points
                    </p>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {exchangeStatus === "success" && (
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-300 font-medium text-sm">Exchange Successful</p>
                    <p className="text-green-400 text-xs">
                      Premium access granted to {username}
                    </p>
                  </div>
                </div>
              )}

              {exchangeStatus === "error" && (
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 font-medium text-sm">Exchange Failed</p>
                    <p className="text-red-400 text-xs">Please enter a valid username</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-blue-300 text-xs">
              Premium includes ad-free listening and exclusive content
            </p>
          </div>
        </div>
      </div>
    </ContributorLayout>
  );
}