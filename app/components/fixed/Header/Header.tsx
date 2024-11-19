"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { NavItemType } from "./Header";

const headerItems: NavItemType[] = [
  { title: "Products", href: "/product" },
  { title: "Tarifs", href: "/tarifs" },
  { title: "Ressources", href: "/ressources" },
];

const Header = () => {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* Burger menu button for mobile */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-48 p-2 bg-white shadow-md">
            <NavItem />
          </PopoverContent>
        </Popover>

        {/* Centered brand name for mobile */}
        <h1 className="text-lg font-semibold uppercase	 text-center hidden md:block  md:text-left md:ml-0">
          Bellone
        </h1>
        <div className="hidden md:block">
          <NavItem />
        </div>

        {/* Right-aligned "Connexion" button for desktop */}
        <div className=" md:flex">
          <Button variant="ghost" asChild>
            <a href="#">Connexion</a>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

const NavItem = () => {
  return (
    <NavigationMenu>
      <ul className="flex flex-col space-y-2 md:flex-row md:align-center md:space-y-0">
        {headerItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {item.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </ul>
    </NavigationMenu>
  );
};
