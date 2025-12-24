import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react"; // Hamburger icon

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Tables", href: "/tables" },
    { name: "Feasibility", href: "/feasibility" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed left-0 top-0 h-full border-r border-gray-200 shadow-md z-50
          w-64 transform md:translate-x-0 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <span className="text-xl font-bold"><Link href="/">SnapFab</Link></span>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Hamburger button for mobile */}
      <button
        className="fixed top-4 left-4 md:hidden z-50 p-2 rounded bg-white shadow"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>
    </>
  );
};

export default Sidebar;