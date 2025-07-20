"use client";

import {
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
  BellIcon,
  EnvelopeIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import React from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="bg-white  border border-[#9F9EA0] rounded-[8.57px] h-[90px] p-[20px]  ">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[15.42px]">
          <h1 className="font-bold text-[17.13px] text-[#000000]">{title}</h1>
          <p className="text-[13.71px] text-[#000000]">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-5">
          <div className="flex items-center bg-gray-100 p-1 rounded-full">
            <button className="p-1.5 bg-white rounded-full shadow">
              <SunIcon className="h-5 w-5 text-blue-600" />
            </button>
            <button className="p-1.5">
              <MoonIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <button className="text-gray-500 hover:text-gray-800">
            <GlobeAltIcon className="h-6 w-6" />
          </button>

          <button className="relative text-gray-500 hover:text-gray-800">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white text-[10px]">
                12
              </span>
            </span>
          </button>

          <button className="text-gray-500 hover:text-gray-800">
            <EnvelopeIcon className="h-6 w-6" />
          </button>

          <button className="text-gray-500 hover:text-gray-800">
            <AdjustmentsHorizontalIcon className="h-6 w-6" />
          </button>

          <div className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
