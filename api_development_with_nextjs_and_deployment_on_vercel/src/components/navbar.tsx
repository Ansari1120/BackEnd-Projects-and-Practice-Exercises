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
      name: "Posts",
      route: "/posts",
    },
    {
      name: "My_Crud_Api_Post_Page",
      route: "/mycrudoperations",
    },
  ];
  return (
    <div>
      <ul className="flex font-black py-19 gap-5">
        {navItems.map((data: any, ind: number) => {
          return (
            <Link
              key={ind}
              href={data.route}
              className={
                pathName === `${data.route}`
                  ? "text-blue-500 font-bold"
                  : "text-black"
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
