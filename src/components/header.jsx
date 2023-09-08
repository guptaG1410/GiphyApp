'use client';
import React, { useState } from 'react';
import { BiMenu } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import Link from 'next/link';
import { logout } from '@/app/firebase';

export default function Header({ user }) {
  const [menu, toggleMenu] = useState(false);

  //Function to toggle Sidebar menu in small screens
  const handleMenu = () => {
    toggleMenu(!menu)
  }
  
  return (
    <>
      <div className="flex w-full bg-black text-white h-14 items-center justify-between px-5">
        <div className="flex md:hidden" onClick={handleMenu}>
          <BiMenu size={25} />
        </div>
        <div className="flex font-extrabold text-2xl text-white">
          <Link href="/">ALPHA BI</Link>
        </div>
        <div className="md:flex gap-5 hidden">
          {user && <div>Hi, {user.email.split('@')[0]}</div>}
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      {/* Mobile Screens */}
      <div
        className={`absolute w-full h-screen top-0 ${
          menu ? 'left-0' : '-left-full'
        } duration-200 bg-white flex flex-col items-end`}
      >
        <div className="p-5" onClick={handleMenu}>
          <AiFillCloseCircle size={25} />
        </div>
        <div className="flex w-full flex-col items-center font-bold my-2">
          {user && (
            <div className="border-y border-gray-300 border-collapse w-full text-center py-2">
              Hi, {user.displayName ?? user.email}
            </div>
          )}
          <div className="border-b border-gray-300 w-full text-center py-2">
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
}
