"use client";
import NavMenu from "@/components/navmenu";
import { CONTRIBUTOR_TOKEN } from "@/constant/contributorToken";
import CustomImage from "@/components/CustomImage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import styles from "./adminNavbar.module.css";
import { Gift } from "lucide-react";

// if somebody uses this it needs to pass something in it
interface ContributorLayoutProps {
  children: ReactNode;
}

const ContributorLayout: React.FC<ContributorLayoutProps> = ({ children }) => {
  // add hooks navigation
  const router = useRouter();
  const pathName = usePathname();

  // Compute the “active key” from the path:
  const activeItem = React.useMemo(() => {
    if (pathName.startsWith("/contributor-artist-view")) return "artists";
    if (
      pathName.startsWith("/contributor-view-all") ||
      pathName.startsWith("/contributor-add-song")
    )
      return "viewAll";
    if (pathName.startsWith("/contributor-exchange-premium")) return "exchange";
    return "dashboard";
  }, [pathName]);

  useEffect(() => {
    const token = localStorage.getItem(CONTRIBUTOR_TOKEN); // hoặc key mà mày lưu
    if (!token) {
      // nếu không có token → redirect về login
      router.replace("/contributor/login");
    }
  }, [router]);

  return (
    <div className="fixed w-full">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar matching new Navbar style */}
        <aside className="w-48 h-screen pb-24 bg-gradient-to-b from-[#39639D] to-black flex flex-col justify-between">
          {/* TOP: Logo + Nav */}
          <div>
            <div className="flex justify-center p-4">
              <CustomImage
                src="/sonata-logo.png"
                alt="logo of the website"
                width={135}
                height={135}
                className="object-contain"
              />
            </div>
            <nav className="flex-1 pt-6">
              {/* Enhanced Contributor Header */}
              <div className="px-4 mb-6">
                <h1 className="text-xl font-semibold text-white mb-1">
                  Contributor
                </h1>
                <div className="w-12 h-0.5 bg-white rounded-full"></div>
              </div>

              <ul className={styles.menu}>
                {/* Artist Management */}
                <li
                  className={`${styles.menuItem} ${
                    activeItem === "artists" ? styles.active : ""
                  }`}
                  onClick={() => router.push("/contributor-artist-view")}
                >
                  <CustomImage
                    src="/layout_imgs/search_logo.png"
                    alt="search logo"
                    height={20}
                    width={20}
                    className="object-contain"
                  />
                  <span className="text-base">Artists Management</span>
                </li>

                {/* Songs & Albums Management */}
                <li
                  className={`${styles.menuItem} ${
                    activeItem === "viewAll" ? styles.active : ""
                  }`}
                  onClick={() => router.push("/contributor-view-all")}
                >
                  <CustomImage
                    src="/layout_imgs/library_logo.png"
                    alt="Library logo"
                    height={20}
                    width={20}
                    className="object-contain"
                  />
                  <span className="text-base">Songs & Albums Management</span>
                </li>

                {/* Exchange Premium */}
                <li
                  className={`${styles.menuItem} ${
                    activeItem === "exchange" ? styles.active : ""
                  }`}
                  onClick={() => router.push("/contributor-exchange-premium")}
                >
                  <Gift />
                  <span className="text-base"> Exchange Premium</span>
                </li>
              </ul>
            </nav>
          </div>

          {/* BOTTOM: Footer Links with separator */}
          <div className="p-4 text-xs border-t border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <Link href="/legal" className="text-gray-400 hover:text-white">
                Legal
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Center
              </Link>
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white">
                Cookies
              </Link>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-gray-400">About Ads</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="relative w-9 h-5 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="mt-4">
              <button className="border border-gray-700 rounded-full py-1 px-3 text-sm text-gray-300 flex items-center hover:bg-slate-700">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <span className="text-sm">English</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Menu */}
          <NavMenu />

          {/* Page Content */}
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ContributorLayout;
