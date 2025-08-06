
'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://static.readdy.ai/image/234cffea93b1d93b402a707b058dd909/56653ba9da6c4ba596021c5abf01f3fe.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Game Studio
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Creating Next-Generation Multiplayer Party Games
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-3xl mx-auto">
            We specialize in fast-paced, competitive gaming experiences that bring players together. 
            Our flagship title MushDash delivers intense multiplayer action with innovative gameplay mechanics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/projects" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap">
              Explore Our Games
            </Link>
            <Link href="/about" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-semibold text-lg transition-all cursor-pointer whitespace-nowrap">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Game Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Featured Game</h2>
            <p className="text-xl text-gray-300">Our latest multiplayer party sensation</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://static.readdy.ai/image/234cffea93b1d93b402a707b058dd909/56653ba9da6c4ba596021c5abf01f3fe.png"
                alt="MushDash Game"
                className="w-full rounded-2xl shadow-2xl object-cover"
              />
            </div>
            
            <div className="text-white">
              <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                MushDash
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                A high-energy multiplayer party game where players control adorable mushroom characters 
                in intense racing competitions. Featuring unique power-ups, dynamic tracks, and 
                competitive gameplay that keeps everyone on the edge of their seats.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="ri-group-fill text-white text-sm"></i>
                  </div>
                  <span>2-8 Players Multiplayer</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <i className="ri-gamepad-fill text-white text-sm"></i>
                  </div>
                  <span>Fast-Paced Party Action</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-trophy-fill text-white text-sm"></i>
                  </div>
                  <span>Competitive Rankings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ready for release</div>
              <div className="text-gray-300">Active Players</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Ready for release</div>
              <div className="text-gray-300">Player Satisfaction</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">24/7</div>
              <div className="text-gray-300">Game Servers</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">1+</div>
              <div className="text-gray-300">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join the Fun?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Experience the thrill of competitive multiplayer gaming with friends and players worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap">
              View All Games
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
