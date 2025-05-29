"use client";
import React, { useState, useEffect } from "react";
import {
  Gift,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Plus,
  Minus,
} from "lucide-react";
import Navbar from "@/components/navbar";
import axios from "axios";
import { LISTENER_TOKEN } from "@/constant/listenerToken";
import SearchBar from "@/components/SearchBar";

export default function ExchangePremiumPage() {
  const [pointsToExchange, setPointsToExchange] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeStatus, setExchangeStatus] = useState(""); // 'success' | 'error' | null

  // User data - replace with actual API data
  const [userPoints, setUserPoints] = useState(0); // Default value for testing
  const [premiumExpiredAt, setPremiumExpiredAt] = useState(
    new Date("2025-06-15") // Fixed date format
  );

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
    setIsLoading(true);
    setExchangeStatus("");

    try {
      const response = await axios.post(
        "https://api.sonata.io.vn/api/v1/listener/exchange-premium",
        {
          pointsExchange: pointsToExchange,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(LISTENER_TOKEN)}`,
          },
        }
      );

      setIsLoading(false);
      setExchangeStatus("success");

      // Update user data from API response
      if (response.data?.data) {
        // Use API response data if available
        setUserPoints(
          response.data.data.points || userPoints - pointsToExchange
        );
        if (response.data.data.premiumExpiredAt) {
          setPremiumExpiredAt(new Date(response.data.data.premiumExpiredAt));
        }
      } else {
        // Fallback to manual calculation
        setUserPoints((prev) => prev - pointsToExchange);

        const daysToAdd = Math.floor(pointsToExchange / 10) * 15;
        const currentExpiry = new Date(premiumExpiredAt);
        const now = new Date();
        const baseDate = currentExpiry > now ? currentExpiry : now;
        const newExpiryDate = new Date(baseDate);
        newExpiryDate.setDate(newExpiryDate.getDate() + daysToAdd);
        setPremiumExpiredAt(newExpiryDate);
      }

      // Reset form after successful exchange
      setTimeout(() => {
        setPointsToExchange(0);
        setExchangeStatus("");
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      setExchangeStatus("error");
      console.error("Exchange failed:", error);
    }
  };

  // Format premium expiry date
  const formatExpiryDate = (dateString: Date) => {
    if (!dateString) return "No active premium";
    const date = new Date(dateString);
    const now = new Date();

    if (date < now) return "Premium expired";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if premium is active
  const isPremiumActive = () => {
    if (!premiumExpiredAt) return false;
    return new Date(premiumExpiredAt) > new Date();
  };

  useEffect(() => {
    const fetchListenerPoints = async () => {
      try {
        // Check if we're in browser environment
        if (typeof window === "undefined") return;

        const response = await axios.get(
          "https://api.sonata.io.vn/api/v1/listener/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(LISTENER_TOKEN)}`,
            },
          }
        );
        setUserPoints(response.data.data.points);
        setPremiumExpiredAt(response.data.data.premiumExpiredAt);
      } catch (err) {
        console.log("Can't fetch listener points.", err);
      }
    };

    fetchListenerPoints();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Side bar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SearchBar />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-6 py-12">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Card Header */}

                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Exchange Premium
                  </h2>
                  <p className="text-blue-100">
                    Convert your points to premium access
                  </p>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  {/* Points Display */}
                  <div className="bg-blue-900/30 rounded-2xl p-6 mb-8 border border-blue-700/30">
                    <div className="text-center">
                      <p className="text-blue-200 text-sm mb-2">
                        Points to Exchange
                      </p>
                      <div className="text-4xl font-bold text-white mb-2">
                        <p>10</p>
                      </div>
                      <p className="text-blue-300 text-sm">Premium Points</p>
                      <p className="text-blue-200 text-sm mb-2 mt-4">For</p>
                      <div className="text-4xl font-bold text-yellow-300 mb-2">
                        <p>15 days</p>
                      </div>
                    </div>
                  </div>

                  {/* User Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Current Points Card */}
                    <div className="bg-blue-900/20 rounded-2xl border border-blue-700/30 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Your Points</p>
                          <p className="text-blue-200 text-sm">
                            Available for exchange
                          </p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-orange-400">
                        {userPoints}
                      </div>
                    </div>

                    {/* Premium Status Card */}
                    <div className="bg-blue-900/20 rounded-2xl border border-blue-700/30 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isPremiumActive()
                              ? "bg-green-500/20"
                              : "bg-gray-500/20"
                          }`}
                        >
                          <Calendar
                            className={`w-5 h-5 ${
                              isPremiumActive()
                                ? "text-green-400"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            Premium Status
                          </p>
                          <p className="text-blue-200 text-sm">
                            {isPremiumActive() ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          isPremiumActive() ? "text-green-400" : "text-gray-400"
                        }`}
                      >
                        {formatExpiryDate(premiumExpiredAt)}
                      </div>
                    </div>
                  </div>

                  {/* Points Exchange Controls */}
                  <div className="bg-blue-900/20 rounded-2xl border border-blue-700/30 p-6 mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium mb-1">
                          Points to Exchange
                        </h3>
                        <p className="text-blue-200 text-sm">
                          Select amount to exchange
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleDecrement}
                          disabled={pointsToExchange <= 0 || isLoading}
                          className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 disabled:bg-gray-500/20 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-200 border border-red-500/30 disabled:border-gray-500/30"
                        >
                          <Minus
                            className={`w-5 h-5 ${
                              pointsToExchange <= 0
                                ? "text-gray-400"
                                : "text-red-400"
                            }`}
                          />
                        </button>

                        <div className="text-2xl font-bold text-white min-w-[60px] text-center">
                          {pointsToExchange}
                        </div>

                        <button
                          onClick={handleIncrement}
                          disabled={pointsToExchange >= userPoints || isLoading}
                          className="w-10 h-10 bg-green-500/20 hover:bg-green-500/30 disabled:bg-gray-500/20 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-200 border border-green-500/30 disabled:border-gray-500/30"
                        >
                          <Plus
                            className={`w-5 h-5 ${
                              pointsToExchange >= userPoints
                                ? "text-gray-400"
                                : "text-green-400"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Exchange Rate Display */}
                    <div className="mt-4 pt-4 border-t border-blue-700/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">Exchange Rate:</span>
                        <span className="text-blue-200">
                          10 points = 15 days premium
                        </span>
                      </div>
                      {pointsToExchange > 0 && (
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-white font-medium">
                            You'll get:
                          </span>
                          <span className="text-yellow-300 font-medium">
                            {Math.floor(pointsToExchange / 10) * 15} days
                            premium
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Exchange Button */}
                  <button
                    onClick={handleExchange}
                    disabled={
                      isLoading ||
                      pointsToExchange <= 0 ||
                      userPoints < pointsToExchange
                    }
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Exchange...
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        Exchange Premium
                      </>
                    )}
                  </button>

                  {/* Insufficient Points Warning */}
                  {userPoints < pointsToExchange && pointsToExchange > 0 && (
                    <div className="mt-4 bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-300 font-medium">
                          Insufficient Points
                        </p>
                        <p className="text-yellow-400 text-sm">
                          You need {pointsToExchange - userPoints} more points
                          to exchange
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status Messages */}
                  {exchangeStatus === "success" && (
                    <div className="mt-6 bg-green-900/30 border border-green-700/50 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-green-300 font-medium">
                          Exchange Successful!
                        </p>
                        <p className="text-green-400 text-sm">
                          Premium access has been granted.
                        </p>
                      </div>
                    </div>
                  )}

                  {exchangeStatus === "error" && (
                    <div className="mt-6 bg-red-900/30 border border-red-700/50 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <div>
                        <p className="text-red-300 font-medium">
                          Exchange Failed
                        </p>
                        <p className="text-red-400 text-sm">
                          Please enter a valid username
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Info */}
              <div className="text-center mt-8 text-blue-300 text-sm">
                <p>
                  Premium access includes ad-free listening and exclusive
                  content
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
