"use client";

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const navlinks = {
    name: "Synibe",
    links: [
        { name: "Home", href: "/" },
        { name: "How it works ", href: "/" },
        { name: "Pricing", href: "/pricing" },
        { name: "About", href: "/about" },
        { name: "Help", href: "/help" },
        { name: "Contact", href: "/contact" },
    ]
}

const Navbar = () => {
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
        <div className='fixed card z-50 w-full flex justify-between rounded-none text-sm select-none'>
            <ul className="flex gap-4 justify-center items-center px-2">
                  <Link href="/" onClick={(e) => handleClick(e, "/")}><li className="p-4 font-bold text-xl">{navlinks.name}</li></Link>
                {navlinks.links.map((link, index) => (
                    <li className="p-2  hover:text-purple-400 transition-all duration-700" key={index}>
                        <Link href={link.href} onClick={(e) => handleClick(e, link.href)}>{link.name}</Link>
                    </li>
                ))}
            </ul>
            <ul className="flex gap-4 justify-center items-center px-4">

                <li className="p-2"><Search /></li>
                <li className="p-2"><Avatar>
                    <AvatarImage className="" src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar></li>
                <li className="p-2"><Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all duration-500 cursor-pointer">Start Watching</Button></li>
            </ul>
        </div>
    )
}

export default Navbar