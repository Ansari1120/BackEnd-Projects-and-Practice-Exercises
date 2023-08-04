"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const pathName = usePathname();
  console.log(pathName);
  const navItems = [
    {
      name: "Home",
      route: "/",
    },
    {
      name: "About",
      route: "/about",
    },
    {
      name: "Blogs",
      route: "/mycrudoperations",
    },
  ];
  return (
    <div>
      <ul className="flex font-black py-19 gap-5 justify-center text-xl">
        {navItems.map((data: any, ind: number) => {
          return (
            <Link
              key={ind}
              href={data.route}
              className={
                pathName === `${data.route}`
                  ? "text-black font-bold bg-gray-400 bg-opacity-50 p-2 rounded-md"
                  : "text-white"
              }
            >
              {data.name}
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Navbar;
