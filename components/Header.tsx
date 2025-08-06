
'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <nav className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="https://static.readdy.ai/image/234cffea93b1d93b402a707b058dd909/61a4d82f007eb480da926a6f4b53ecaf.png" 
              alt="Company Logo" 
              className="h-8 w-auto"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-purple-400 transition-colors cursor-pointer whitespace-nowrap">Home</Link>
            <Link href="/about" className="text-white hover:text-purple-400 transition-colors cursor-pointer whitespace-nowrap">About</Link>
            <Link href="/projects" className="text-white hover:text-purple-400 transition-colors cursor-pointer whitespace-nowrap">Projects</Link>
{/*            <Link href="/contact" className="text-white hover:text-purple-400 transition-colors cursor-pointer whitespace-nowrap">Contact</Link>*/}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4 mt-4">
              <Link href="/" className="text-white hover:text-purple-400 transition-colors cursor-pointer">Home</Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors cursor-pointer">About</Link>
              <Link href="/projects" className="text-white hover:text-purple-400 transition-colors cursor-pointer">Projects</Link>
{/*              <Link href="/contact" className="text-white hover:text-purple-400 transition-colors cursor-pointer">Contact</Link>*/}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
