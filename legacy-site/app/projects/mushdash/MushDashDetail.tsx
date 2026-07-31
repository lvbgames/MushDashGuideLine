'use client';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export default function MushDashDetail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-blue-900">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section 
          className="relative py-32 overflow-hidden"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Epic%20MushDash%20racing%20game%20hero%20banner%20with%20colorful%20mushroom%20characters%20in%20dynamic%20action%20poses%2C%20vibrant%20neon%20racing%20tracks%20with%20purple%20and%20blue%20lighting%2C%20competitive%20multiplayer%20gaming%20atmosphere%2C%20high-energy%20particle%20effects%2C%20modern%20game%20UI%20elements%2C%20clean%20background%20for%20text%20overlay&width=1920&height=800&seq=mushdash-hero&orientation=landscape')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <span className="bg-green-500 text-black px-4 py-2 rounded-full font-bold">
                  AVAILABLE NOW
                </span>
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold">
                  MULTIPLAYER
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                Mush<span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Dash</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8">
                The ultimate multiplayer party racing game featuring adorable mushroom characters, 
                power-packed gameplay, and competitive thrills for up to 8 players.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap">
                  <i className="ri-play-fill mr-2"></i>
                  Play Now
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-bold text-lg transition-all cursor-pointer whitespace-nowrap">
                  <i className="ri-download-fill mr-2"></i>
                  Free Download
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Game Features */}
        <section className="py-20 bg-black/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Game Features</h2>
              <p className="text-xl text-gray-300">
                Everything that makes MushDash the perfect party game
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-green-600/20 p-8 rounded-2xl border border-green-500/30">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
                  <i className="ri-group-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">8-Player Multiplayer</h3>
                <p className="text-gray-300">
                  Race with up to 8 friends locally or online. Support for both casual and 
                  competitive play modes with dynamic matchmaking.
                </p>
              </div>
              
              <div className="bg-purple-600/20 p-8 rounded-2xl border border-purple-500/30">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <i className="ri-magic-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Unique Power-ups</h3>
                <p className="text-gray-300">
                  Over 20 different power-ups including speed boosts, defensive shields, 
                  and special abilities that can turn the tide of any race.
                </p>
              </div>
              
              <div className="bg-blue-600/20 p-8 rounded-2xl border border-blue-500/30">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <i className="ri-road-map-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Dynamic Tracks</h3>
                <p className="text-gray-300">
                  12 unique racing tracks with environmental hazards, shortcuts, 
                  and interactive elements that change during races.
                </p>
              </div>
              
              <div className="bg-orange-600/20 p-8 rounded-2xl border border-orange-500/30">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <i className="ri-palette-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Character Customization</h3>
                <p className="text-gray-300">
                  Customize your mushroom racer with dozens of colors, patterns, 
                  and accessories. Unlock new styles by winning races.
                </p>
              </div>
              
              <div className="bg-yellow-600/20 p-8 rounded-2xl border border-yellow-500/30">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                  <i className="ri-trophy-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Ranked Seasons</h3>
                <p className="text-gray-300">
                  Compete in seasonal tournaments, climb leaderboards, 
                  and earn exclusive rewards for top performers.
                </p>
              </div>
              
              <div className="bg-cyan-600/20 p-8 rounded-2xl border border-cyan-500/30">
                <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <i className="ri-gamepad-2-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Cross-Platform Play</h3>
                <p className="text-gray-300">
                  Play with friends across PC, console, and mobile devices. 
                  Seamless cross-platform progression and friend systems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Screenshots Gallery */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Screenshots</h2>
              <p className="text-xl text-gray-300">
                See MushDash in action
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img 
                src="https://readdy.ai/api/search-image?query=MushDash%20multiplayer%20racing%20gameplay%20screenshot%20showing%20multiple%20colorful%20mushroom%20characters%20racing%20on%20vibrant%20neon%20track%2C%20competitive%20racing%20interface%20with%20player%20names%20and%20positions%2C%20dynamic%20lighting%20effects%2C%20party%20game%20atmosphere%20with%20bright%20colors&width=600&height=400&seq=screenshot-1&orientation=landscape"
                alt="MushDash Multiplayer Racing"
                className="w-full rounded-2xl shadow-2xl object-cover"
              />
              <img 
                src="https://readdy.ai/api/search-image?query=MushDash%20power-up%20collection%20scene%20with%20mushroom%20character%20grabbing%20special%20items%2C%20glowing%20power-up%20effects%2C%20colorful%20track%20environment%20with%20obstacles%20and%20boosts%2C%20exciting%20action%20gameplay%20moment%2C%20vibrant%20particle%20effects&width=600&height=400&seq=screenshot-2&orientation=landscape"
                alt="Power-ups in Action"
                className="w-full rounded-2xl shadow-2xl object-cover"
              />
              <img 
                src="https://readdy.ai/api/search-image?query=MushDash%20character%20customization%20screen%20showing%20different%20mushroom%20designs%2C%20colorful%20character%20selection%20interface%2C%20various%20costume%20options%20and%20accessories%2C%20modern%20game%20UI%20with%20purple%20and%20blue%20theme%2C%20player%20customization%20menu&width=600&height=400&seq=screenshot-3&orientation=landscape"
                alt="Character Customization"
                className="w-full rounded-2xl shadow-2xl object-cover"
              />
              <img 
                src="https://readdy.ai/api/search-image?query=MushDash%20finish%20line%20celebration%20with%20multiple%20mushroom%20characters%20crossing%20together%2C%20victory%20effects%20and%20confetti%2C%20leaderboard%20display%20showing%20player%20rankings%2C%20competitive%20gaming%20celebration%20scene%2C%20energetic%20atmosphere&width=600&height=400&seq=screenshot-4&orientation=landscape"
                alt="Victory Celebration"
                className="w-full rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* Game Modes */}
        <section className="py-20 bg-black/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Game Modes</h2>
              <p className="text-xl text-gray-300">
                Multiple ways to play and compete
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-600/30 to-blue-600/30 p-8 rounded-2xl border border-green-500/40">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <i className="ri-timer-flash-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Quick Race</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Jump into fast 3-5 minute races perfect for quick gaming sessions. 
                  Ideal for casual play with friends or warming up before competitive matches.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>2-8 Players</span>
                  <span>•</span>
                  <span>3-5 Minutes</span>
                  <span>•</span>
                  <span>All Skill Levels</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 p-8 rounded-2xl border border-purple-500/40">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <i className="ri-trophy-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Ranked Tournament</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Climb the competitive ladder in intense tournament-style matches. 
                  Seasonal rankings, skill-based matchmaking, and exclusive rewards.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>4-8 Players</span>
                  <span>•</span>
                  <span>15-20 Minutes</span>
                  <span>•</span>
                  <span>Competitive</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-600/30 to-yellow-600/30 p-8 rounded-2xl border border-orange-500/40">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <i className="ri-team-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Team Relay</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Work together in 2v2 or 4v4 team races where coordination and 
                  strategy matter as much as individual skill. Perfect for group play.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>4-8 Players</span>
                  <span>•</span>
                  <span>10-12 Minutes</span>
                  <span>•</span>
                  <span>Team Strategy</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-600/30 to-blue-600/30 p-8 rounded-2xl border border-cyan-500/40">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                    <i className="ri-maze-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Challenge Mode</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Solo challenges with unique objectives like time trials, obstacle courses, 
                  and special conditions. Unlock rewards and improve your skills.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>1 Player</span>
                  <span>•</span>
                  <span>5-10 Minutes</span>
                  <span>•</span>
                  <span>Skill Building</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">System Requirements</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-600/20 p-8 rounded-2xl border border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-6">Minimum Requirements</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">OS:</span>
                    <span className="text-white">Windows 10 / macOS 10.14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">Processor:</span>
                    <span className="text-white">Intel i3-6100 / AMD FX-6300</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">Memory:</span>
                    <span className="text-white">4 GB RAM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">Graphics:</span>
                    <span className="text-white">GTX 750 Ti / RX 460</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">Storage:</span>
                    <span className="text-white">2 GB available space</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">Network:</span>
                    <span className="text-white">Broadband Internet connection</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-600/20 p-8 rounded-2xl border border-blue-500/30">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">Recommended Requirements</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">OS:</span>
                    <span className="text-white">Windows 11 / macOS 12.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">Processor:</span>
                    <span className="text-white">Intel i5-8400 / AMD Ryzen 5 2600</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">Memory:</span>
                    <span className="text-white">8 GB RAM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">Graphics:</span>
                    <span className="text-white">GTX 1060 / RX 580</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">Storage:</span>
                    <span className="text-white">4 GB available space (SSD)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">Network:</span>
                    <span className="text-white">Stable broadband connection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community & Updates */}
        <section className="py-20 bg-black/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Community & Updates</h2>
              <p className="text-xl text-gray-300">
                Join the MushDash community and stay updated
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-purple-600/20 p-8 rounded-2xl border border-purple-500/30">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-discord-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Join Discord</h3>
                <p className="text-gray-300 mb-6">
                  Connect with players, find teammates, and get the latest news from the dev team.
                </p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap">
                  Join Server
                </button>
              </div>
              
              <div className="text-center bg-green-600/20 p-8 rounded-2xl border border-green-500/30">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-steam-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Steam Community</h3>
                <p className="text-gray-300 mb-6">
                  Rate the game, share screenshots, and participate in community events.
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap">
                  Visit Page
                </button>
              </div>
              
              <div className="text-center bg-blue-600/20 p-8 rounded-2xl border border-blue-500/30">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-twitter-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Follow Updates</h3>
                <p className="text-gray-300 mb-6">
                  Get instant updates on patches, tournaments, and new content releases.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap">
                  Follow Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Race?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Download MushDash now and join thousands of players in the ultimate 
              multiplayer party racing experience!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap">
                <i className="ri-download-fill mr-2"></i>
                Free Download
              </button>
              <Link href="/projects" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-bold text-lg transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-arrow-left-fill mr-2"></i>
                Back to Projects
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}