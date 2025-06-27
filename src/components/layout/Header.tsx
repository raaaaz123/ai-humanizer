"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export const Header = () => {
  const { user, userData, loading, signIn, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <header className="border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-[#1e293b]">
          AI Humanizer
        </Link>
        
        <nav>
          <ul className="flex gap-6 items-center">
            <li>
              <Link 
                href="/" 
                className={`hover:text-[#b074d4] transition-colors`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/pricing" 
                className={`hover:text-[#b074d4] transition-colors`}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link 
                href="/support" 
                className={`hover:text-[#b074d4] transition-colors`}
              >
                Support
              </Link>
            </li>
            
            {!loading && (
              <>
                {user ? (
                  <li className="relative">
                    <button 
                      onClick={handleProfileClick}
                      className="flex items-center focus:outline-none"
                    >
                      {user.photoURL ? (
                        <Image 
                          src={user.photoURL} 
                          alt="Profile" 
                          width={40} 
                          height={40} 
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#b074d4] flex items-center justify-center text-white">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                      )}
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-[#e2e8f0]">
                        <div className="px-4 py-2 border-b border-[#e2e8f0]">
                          <p className="text-sm font-medium">{user.displayName}</p>
                          <p className="text-xs text-[#64748b] truncate">{user.email}</p>
                        </div>
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm hover:bg-[#f8f0ff]"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <button 
                          onClick={() => {
                            signOut();
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f8f0ff] text-[#ef4444]"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </li>
                ) : (
                  <>
                    <li>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => signIn()}
                      >
                        Sign In
                      </Button>
                    </li>
                    <li>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => signIn()}
                      >
                        Sign Up
                      </Button>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}; 