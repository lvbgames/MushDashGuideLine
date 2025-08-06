
'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://static.readdy.ai/image/234cffea93b1d93b402a707b058dd909/61a4d82f007eb480da926a6f4b53ecaf.png" 
                alt="Company Logo" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Creating innovative multiplayer party games that bring people together. 
              We specialize in fast-paced, competitive gaming experiences that are easy to learn but hard to master.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/Lv_B_Games" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                <i className="ri-twitter-fill text-white"></i>
              </a>
              <a href="https://discord.gg/zshRC5bccw" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                <i className="ri-discord-fill text-white"></i>
              </a>
              <a href="https://store.steampowered.com/app/3153140/Mush_Dash/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                <i className="ri-steam-fill text-white"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors cursor-pointer">About Us</Link>
              <Link href="/projects" className="block text-gray-300 hover:text-white transition-colors cursor-pointer">Our Games</Link>
{/*              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors cursor-pointer">Contact</Link>*/}
            </div>
          </div>
          
          {/*<div>*/}
          {/*  <h4 className="font-semibold mb-4">Support</h4>*/}
          {/*  <div className="space-y-2">*/}
          {/*    <a href="#" className="block text-gray-300 hover:text-white transition-colors cursor-pointer">Help Center</a>*/}
          {/*    <a href="#" className="block text-gray-300 hover:text-white transition-colors cursor-pointer">Bug Reports</a>*/}
          {/*    <a href="#" className="block text-gray-300 hover:text-white transition-colors cursor-pointer">Community</a>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            2024 Lv.B Game Studio. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
