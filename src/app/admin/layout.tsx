import BottomBanner from "@/components/bottem_banner";
import NavbarAdmin from "@/components/navbar-admin";
import NavMenu from "@/components/navmenu";

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="fixed w-full">
        {/* all the navigation bar */}
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar */}
        <div>
          <NavbarAdmin />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <NavMenu />

          {/* Main Content (Dynamic via children) */}
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
