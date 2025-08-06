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
                  
                  {/*<div className="flex flex-col sm:flex-row gap-4">*/}
                  {/*  <Link href="/projects/mushdash" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 cursor-pointer text-center whitespace-nowrap">*/}
                  {/*    Learn More*/}
                  {/*  </Link>*/}
                  {/*  <button className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-6 py-3 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap">*/}
                  {/*    Play Now*/}
                  {/*  </button>*/}
                  {/*</div>*/}
                </div>
                
                {/*<div className="relative">*/}
                {/*  <img */}
                {/*    src="https://readdy.ai/api/search-image?query=Vibrant%20multiplayer%20racing%20game%20screenshot%20featuring%20colorful%20mushroom%20characters%20on%20dynamic%20neon%20tracks%2C%20competitive%20gaming%20interface%20with%20multiple%20players%2C%20energetic%20party%20game%20atmosphere%2C%20bright%20colors%20with%20green%20and%20blue%20lighting%20effects%2C%20modern%20UI%20elements%2C%20action-packed%20gameplay%20scene&width=600&height=500&seq=mushdash-main&orientation=landscape"*/}
                {/*    alt="MushDash Gameplay"*/}
                {/*    className="w-full h-full object-cover"*/}
                {/*  />*/}
                {/*  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-green-600/20"></div>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Projects */}
        {/*<section className="py-20">*/}
        {/*  <div className="max-w-6xl mx-auto px-6">*/}
        {/*    <div className="text-center mb-16">*/}
        {/*      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Coming Soon</h2>*/}
        {/*      <p className="text-xl text-gray-300">*/}
        {/*        Exciting new projects currently in development*/}
        {/*      </p>*/}
        {/*    </div>*/}
            
        {/*    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">*/}
        {/*      <div className="bg-purple-900/20 rounded-2xl border border-purple-500/30 overflow-hidden">*/}
        {/*        <img */}
        {/*          src="https://readdy.ai/api/search-image?query=Futuristic%20space-themed%20multiplayer%20game%20concept%20art%2C%20sleek%20spacecraft%20racing%20through%20cosmic%20environments%2C%20neon%20purple%20and%20pink%20lighting%2C%20competitive%20racing%20atmosphere%2C%20modern%20sci-fi%20aesthetic%20with%20clean%20geometric%20design%2C%20party%20game%20style%20with%20vibrant%20colors&width=500&height=300&seq=project-stellar&orientation=landscape"*/}
        {/*          alt="Stellar Racers"*/}
        {/*          className="w-full h-48 object-cover"*/}
        {/*        />*/}
        {/*        <div className="p-6">*/}
        {/*          <div className="flex items-center justify-between mb-4">*/}
        {/*            <h3 className="text-2xl font-bold text-white">Stellar Racers</h3>*/}
        {/*            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">*/}
        {/*              IN DEVELOPMENT*/}
        {/*            </span>*/}
        {/*          </div>*/}
        {/*          <p className="text-gray-300 mb-4">*/}
        {/*            Take the competition to space! Race through cosmic tracks with anti-gravity */}
        {/*            mechanics and zero-g power-ups in this thrilling sequel experience.*/}
        {/*          </p>*/}
        {/*          <div className="flex items-center space-x-4 text-sm text-gray-400">*/}
        {/*            <span className="flex items-center space-x-1">*/}
        {/*              <i className="ri-calendar-fill"></i>*/}
        {/*              <span>Q3 2024</span>*/}
        {/*            </span>*/}
        {/*            <span className="flex items-center space-x-1">*/}
        {/*              <i className="ri-group-fill"></i>*/}
        {/*              <span>2-12 Players</span>*/}
        {/*            </span>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}
              
        {/*      <div className="bg-orange-900/20 rounded-2xl border border-orange-500/30 overflow-hidden">*/}
        {/*        <img */}
        {/*          src="https://readdy.ai/api/search-image?query=Medieval%20fantasy%20battle%20arena%20game%20concept%2C%20colorful%20cartoon%20warriors%20with%20weapons%20and%20shields%2C%20competitive%20multiplayer%20combat%20scene%2C%20vibrant%20orange%20and%20red%20lighting%2C%20party%20game%20aesthetic%20with%20friendly%20character%20design%2C%20action-packed%20medieval%20tournament%20atmosphere&width=500&height=300&seq=project-battle&orientation=landscape"*/}
        {/*          alt="Battle Buddies"*/}
        {/*          className="w-full h-48 object-cover"*/}
        {/*        />*/}
        {/*        <div className="p-6">*/}
        {/*          <div className="flex items-center justify-between mb-4">*/}
        {/*            <h3 className="text-2xl font-bold text-white">Battle Buddies</h3>*/}
        {/*            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">*/}
        {/*              CONCEPT*/}
        {/*            </span>*/}
        {/*          </div>*/}
        {/*          <p className="text-gray-300 mb-4">*/}
        {/*            Team-based arena combat with customizable characters and strategic gameplay. */}
        {/*            Form alliances, battle rivals, and climb the leaderboards together.*/}
        {/*          </p>*/}
        {/*          <div className="flex items-center space-x-4 text-sm text-gray-400">*/}
        {/*            <span className="flex items-center space-x-1">*/}
        {/*              <i className="ri-calendar-fill"></i>*/}
        {/*              <span>Q1 2025</span>*/}
        {/*            </span>*/}
        {/*            <span className="flex items-center space-x-1">*/}
        {/*              <i className="ri-group-fill"></i>*/}
        {/*              <span>4-16 Players</span>*/}
        {/*            </span>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</section>*/}

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
        </section>

      {/*  */}{/* Call to Action */}
      {/*  <section className="py-20">*/}
      {/*    <div className="max-w-4xl mx-auto text-center px-6">*/}
      {/*      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">*/}
      {/*        Have an Idea for a Game?*/}
      {/*      </h2>*/}
      {/*      <p className="text-xl text-gray-300 mb-8">*/}
      {/*        We're always interested in hearing from fellow gamers and potential collaborators. */}
      {/*        Share your ideas with us!*/}
      {/*      </p>*/}
      {/*      <Link href="/contact" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap">*/}
      {/*        Get In Touch*/}
      {/*      </Link>*/}
      {/*    </div>*/}
      {/*  </section>*/}
      {/*</div>*/}

      <Footer />
    </div>
  );
}