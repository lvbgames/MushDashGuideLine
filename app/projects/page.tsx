'use client';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function Projects() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Games</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our collection of multiplayer party games designed to bring people together 
              through competitive fun and innovative gameplay mechanics.
            </p>
          </div>
        </section>

        {/* Featured Game - MushDash */}
        <section className="py-20 bg-black/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-3xl border border-green-500/30 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-12">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      FEATURED
                    </span>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      MULTIPLAYER
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    MushDash
                  </h2>
                  
                  <p className="text-lg text-gray-300 mb-8">
                    An electrifying multiplayer party game where adorable mushroom characters race 
                    through dynamic tracks filled with power-ups, obstacles, and intense competition. 
                    Perfect for 2-8 players looking for fast-paced fun!
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3 text-white">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <i className="ri-group-fill"></i>
                      </div>
                      <span className="font-semibold">2-8 Players</span>
                      <span className="text-gray-400">Local & Online Multiplayer</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <i className="ri-timer-fill"></i>
                      </div>
                      <span className="font-semibold">5-15 Min</span>
                      <span className="text-gray-400">Quick Matches</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <i className="ri-trophy-fill"></i>
                      </div>
                      <span className="font-semibold">Ranked Mode</span>
                      <span className="text-gray-400">Competitive Rankings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Development Process */}
        <section className="py-20 bg-black/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Development Process</h2>
              <p className="text-xl text-gray-300">
                How we create engaging multiplayer experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-lightbulb-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Concept</h3>
                <p className="text-gray-300">
                  Brainstorming innovative gameplay mechanics that prioritize fun and social interaction.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-code-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Prototype</h3>
                <p className="text-gray-300">
                  Rapid prototyping to test core mechanics and multiplayer networking systems.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-palette-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Polish</h3>
                <p className="text-gray-300">
                  Refining visuals, audio, and user experience to create a cohesive, polished product.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-rocket-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Launch</h3>
                <p className="text-gray-300">
                  Community testing, feedback integration, and continuous post-launch support.
                </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      <Footer />
    </div>
  );
}
