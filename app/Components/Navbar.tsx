"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Search, User, Settings, Menu, X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const navlinks = {
  name: "Synibe",
  links: [
    { name: "Home", href: "/" },
    { name: "How it works ", href: "/#how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Help", href: "/help" },
    { name: "Contact", href: "/contact" },
  ],
};

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setMobileOpen(false);
  };

  return (
    <>
      <div className="fixed card z-50 w-full flex justify-between items-center rounded-none text-sm select-none px-2 sm:px-4">
        {/* Left: Brand + Desktop Nav Links */}
        <ul className="flex gap-2 sm:gap-4 justify-center items-center">
          <Link href="/" onClick={(e) => handleClick(e, "/")}>
            <li className="p-3 sm:p-4 font-bold text-lg sm:text-xl">
              {navlinks.name}
            </li>
          </Link>
          {/* Desktop nav links — hidden on mobile */}
          {navlinks.links.map((link, index) => (
            <li
              className="p-2 hover:text-purple-400 transition-all duration-700 hidden md:block"
              key={index}
            >
              <Link href={link.href} onClick={(e) => handleClick(e, link.href)}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Actions */}
        <ul className="flex gap-2 sm:gap-4 justify-center items-center px-2 sm:px-4">
          {/* Search — hidden on very small screens */}
          <li className="p-2 hidden sm:block">
            <Search className="w-5 h-5" />
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
                    {/* <button
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button> */}
                    {/* <button
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button> */}
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
              className="bg-white text-black text-xs sm:text-sm"
              onClick={() => signIn(undefined, { callbackUrl: "/" })}
            >
              Sign In
            </Button>
          )}

          {/* Hamburger — visible only on mobile */}
          <li className="md:hidden">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </li>
        </ul>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className="absolute top-[56px] left-0 right-0 bg-[#0a0a12]/98 backdrop-blur-xl border-b border-white/10 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 56px)" }}
          >
            <nav className="flex flex-col py-4 px-6">
              {navlinks.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="py-3.5 text-base font-medium text-white/80 hover:text-purple-400 border-b border-white/[0.06] transition-colors duration-300 last:border-0"
                >
                  {link.name}
                </Link>
              ))}

              {/* Search on mobile */}
              <div className="flex items-center gap-3 py-3.5 text-white/60 sm:hidden">
                <Search className="w-4 h-4" />
                <span className="text-base font-medium">Search</span>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;