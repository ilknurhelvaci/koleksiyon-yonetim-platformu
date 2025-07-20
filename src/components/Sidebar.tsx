"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HomeIcon,
  ArchiveBoxIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

type NavLink = {
  href: string;
  label: string;
  icon: React.ElementType;
  isDropdown?: boolean;
};

const menuLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  {
    href: "/products",
    label: "Ürünler",
    icon: ArchiveBoxIcon,
    isDropdown: true,
  },
];

const salesLinks: NavLink[] = [
  { href: "/collections", label: "Koleksiyon", icon: ShoppingCartIcon },
];

const Sidebar = () => {
  const pathname = usePathname();

  const renderLinks = (links: NavLink[]) => {
    return links.map((link) => {
      const isActive = pathname.startsWith(link.href);

      return (
        <Link key={link.href} href={link.href}>
          <div
            className={`flex items-center justify-between p-3 my-1  cursor-pointer transition-all duration-200
              ${
                isActive
                  ? "bg-white border border-black  text-gray-900 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            <div className="flex items-center">
              <link.icon className="h-5 w-5 mr-3" />
              <span>{link.label}</span>
            </div>
            {link.isDropdown && (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </Link>
      );
    });
  };

  return (
    <aside className="w-72 h-screen bg-white  flex flex-col">
      {/* Logo  */}
      <div className="h-24 flex items-center justify-center ">
        <div className="">
          <Image
            src="/images/logo2.png"
            alt="Logo"
            width={146}
            height={55}
            priority
            className="object-contain"
          />
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 border border-[#9F9EA0] rounded-[8.57px]">
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            MENÜ
          </h3>
          {renderLinks(menuLinks)}
        </div>

        <div className="mt-6">
          <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Satış
          </h3>
          {renderLinks(salesLinks)}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
