"use client";
import Link from "next/link";
import * as React from "react";
import { BiCopyright } from "react-icons/bi";

const footerContent = [
  {
    title: "Bellone",
    href: "/",
  },
  {
    title: "mentions-légales",
    href: "/mentions-legales",
  },
  {
    title: "frenchwebdeveloper",
    icon: <BiCopyright />,
  },
];
const Footer = () => {
  return (
    <footer className="w-full max-w-[90%] px-2 border-t-[1px] mx-auto py-4">
      <ul className="flex justify-between items-center">
        {footerContent?.map((item) => {
          return (
            <li className="flex items-center gap-1" key={item.title}>
              {item?.icon && item.icon}
              {item?.href !== undefined ? (
                <Link href={item?.href}>{item?.title}</Link>
              ) : (
                item?.title
              )}
            </li>
          );
        })}
      </ul>
    </footer>
  );
};

export default Footer;
