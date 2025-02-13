"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useState } from "react";

interface Props {
  path: string;
  icon: JSX.Element;
  title: string;
  subTitle: string;
  subItems?: { path: string; title: string }[];
}

const SidebarMenuItem = ({ path, icon, title, subTitle, subItems }: Props) => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-2 inline-flex space-x-2 items-center border-b border-slate-700 py-3 hover:bg-white/5 transition ease-linear duration-150 cursor-pointer
          ${currentPath === path ? "bg-blue-800" : ""}
        `}
      >
        <div>{icon}</div>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-5 text-white">{title}</span>
          <span className="text-sm text-white/50 hidden md:block">
            {subTitle}
          </span>
        </div>
      </div>

      {/* Submenús */}
      {subItems && isOpen && (
        <div className="ml-8 mt-2 space-y-2">
          {subItems.map((subItem) => (
            <Link
              key={subItem.path}
              href={subItem.path}
              className={`
                block px-2 py-2 text-sm text-slate-300 rounded hover:bg-white/10 transition
                ${currentPath === subItem.path ? "bg-blue-700 text-white" : ""}
              `}
            >
              {subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuItem;
