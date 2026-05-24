"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Search, User, Settings } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const navlinks = {
  name: "Synibe",
  links: [
    { name: "Home", href: "/" },
    { name: "How it works ", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Help", href: "/help" },
    { name: "Contact", href: "/contact" },
  ],
};

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="fixed card z-50 w-full flex justify-between rounded-none text-sm select-none">
      <ul className="flex gap-4 justify-center items-center px-2">
        <Link href="/" onClick={(e) => handleClick(e, "/")}>
          <li className="p-4 font-bold text-xl">{navlinks.name}</li>
        </Link>
        {navlinks.links.map((link, index) => (
          <li
            className="p-2 hover:text-purple-400 transition-all duration-700"
            key={index}
          >
            <Link href={link.href} onClick={(e) => handleClick(e, link.href)}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex gap-4 justify-center items-center px-4">
        <li className="p-2">
          <Search />
        </li>

        {session ? (
          <li className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="rounded-full overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-black"
            >
              <Image
                src={session.user?.image!}
                alt="Profile"
                height={36}
                width={36}
                className="rounded-full"
              />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-xl overflow-hidden border border-white/10 bg-[#0d0d14]/95 backdrop-blur-xl shadow-2xl shadow-purple-900/20 z-50 animate-in">
                {/* User Info Header */}
                <div className="px-4 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Image
                      src={session.user?.image!}
                      alt="Profile"
                      height={40}
                      width={40}
                      className="rounded-full"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-white/10 py-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </li>
        ) : (
          <Button
            className="bg-white text-black"
            onClick={() => signIn(undefined, { callbackUrl: "/" })}
          >
            Sign In
          </Button>
        )}

        <li className="p-2">
          <Link href="/create-room">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all duration-500 cursor-pointer">
              Start Watching
            </Button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;