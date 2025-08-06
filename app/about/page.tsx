'use client';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Our Studio</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We are a passionate indie game development studio dedicated to creating innovative 
              multiplayer party games that bring people together through competitive fun.
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 bg-black/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://readdy.ai/api/search-image?query=Modern%20indie%20game%20development%20studio%20workspace%20with%20creative%20team%20collaboration%2C%20colorful%20gaming%20setup%20with%20multiple%20monitors%20displaying%20game%20development%20tools%2C%20contemporary%20office%20environment%20with%20purple%20and%20blue%20lighting%2C%20professional%20game%20developers%20working%20together%2C%20clean%20minimalist%20design%20aesthetic&width=600&height=400&seq=studio-workspace&orientation=landscape"
                  alt="Lv.B Game Studio"
                  className="w-full rounded-2xl shadow-2xl object-top"
                />
              </div>
              
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-gray-300 mb-6">
                  Founded in 2024, Lv.B Games emerged from a shared passion for creating games that 
                  bring friends together. Our small but dedicated team combines years of industry 
                  experience with fresh, innovative ideas to craft unique gaming experiences.
                </p>
                <p className="text-lg text-gray-300 mb-6">
                  We believe that the best games are those that create memorable moments between 
                  players. Every project we undertake is designed with social interaction, 
                  competitive balance, and pure fun at its core.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-purple-600/20 rounded-xl">
                    <div className="text-2xl font-bold text-purple-400">2024</div>
                    <div className="text-sm text-gray-300">Founded</div>
                  </div>
                  <div className="text-center p-4 bg-green-600/20 rounded-xl">
                    <div className="text-2xl font-bold text-green-400">3</div>
                    <div className="text-sm text-gray-300">Team Members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                To create multiplayer gaming experiences that foster genuine connections 
                between players while delivering competitive, skill-based gameplay.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-purple-600/10 rounded-2xl border border-purple-500/20">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-group-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Community First</h3>
                <p className="text-gray-300">
                  We prioritize building strong gaming communities where players can connect, 
                  compete, and create lasting friendships.
                </p>
              </div>
              
              <div className="text-center p-8 bg-green-600/10 rounded-2xl border border-green-500/20">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-trophy-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Competitive Balance</h3>
                <p className="text-gray-300">
                  Every game mechanic is carefully crafted to ensure fair, skill-based 
                  competition that rewards practice and strategy.
                </p>
              </div>
              
              <div className="text-center p-8 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-lightbulb-fill text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Innovation</h3>
                <p className="text-gray-300">
                  We constantly push boundaries with unique gameplay mechanics and 
                  creative approaches to multiplayer gaming.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {/*<section className="py-20 bg-black/20">*/}
        {/*  <div className="max-w-6xl mx-auto px-6">*/}
        {/*    <div className="text-center mb-16">*/}
        {/*      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Meet Our Team</h2>*/}
        {/*      <p className="text-xl text-gray-300">*/}
        {/*        The creative minds behind Lv.B Games*/}
        {/*      </p>*/}
        {/*    </div>*/}
            
        {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">*/}
        {/*      <div className="text-center bg-purple-900/20 p-8 rounded-2xl border border-purple-500/20">*/}
        {/*        <img */}
        {/*          src="https://readdy.ai/api/search-image?query=Professional%20game%20developer%20portrait%2C%20creative%20individual%20in%20modern%20gaming%20studio%20environment%2C%20confident%20expression%2C%20contemporary%20workspace%20background%20with%20purple%20lighting%2C%20clean%20professional%20headshot%20style%2C%20minimalist%20aesthetic&width=300&height=300&seq=team-lead&orientation=squarish"*/}
        {/*          alt="Alex Chen - Game Director"*/}
        {/*          className="w-24 h-24 rounded-full mx-auto mb-4 object-top"*/}
        {/*        />*/}
        {/*        <h3 className="text-xl font-bold text-white mb-2">Alex Chen</h3>*/}
        {/*        <p className="text-purple-400 mb-3">Game Director & Founder</p>*/}
        {/*        <p className="text-gray-300 text-sm">*/}
        {/*          10+ years in game development, previously worked at major studios. */}
        {/*          Passionate about multiplayer game design and community building.*/}
        {/*        </p>*/}
        {/*      </div>*/}
              
        {/*      <div className="text-center bg-purple-900/20 p-8 rounded-2xl border border-purple-500/20">*/}
        {/*        <img */}
        {/*          src="https://readdy.ai/api/search-image?query=Female%20game%20programmer%20portrait%2C%20skilled%20developer%20working%20on%20code%2C%20modern%20tech%20workspace%20background%20with%20blue%20and%20purple%20lighting%2C%20professional%20appearance%2C%20confident%20expression%2C%20minimalist%20studio%20environment&width=300&height=300&seq=team-programmer&orientation=squarish"*/}
        {/*          alt="Sarah Kim - Lead Programmer"*/}
        {/*          className="w-24 h-24 rounded-full mx-auto mb-4 object-top"*/}
        {/*        />*/}
        {/*        <h3 className="text-xl font-bold text-white mb-2">Sarah Kim</h3>*/}
        {/*        <p className="text-green-400 mb-3">Lead Programmer</p>*/}
        {/*        <p className="text-gray-300 text-sm">*/}
        {/*          Expert in multiplayer networking and game optimization. */}
        {/*          Ensures our games run smoothly across all platforms.*/}
        {/*        </p>*/}
        {/*      </div>*/}
              
        {/*      <div className="text-center bg-purple-900/20 p-8 rounded-2xl border border-purple-500/20">*/}
        {/*        <img */}
        {/*          src="https://readdy.ai/api/search-image?query=Creative%20game%20artist%20portrait%2C%20talented%20designer%20working%20on%20character%20concepts%2C%20artistic%20workspace%20with%20colorful%20design%20elements%2C%20modern%20studio%20environment%2C%20professional%20creative%20individual%2C%20inspiring%20aesthetic&width=300&height=300&seq=team-artist&orientation=squarish"*/}
        {/*          alt="Mike Rodriguez - Art Director"*/}
        {/*          className="w-24 h-24 rounded-full mx-auto mb-4 object-top"*/}
        {/*        />*/}
        {/*        <h3 className="text-xl font-bold text-white mb-2">Mike Rodriguez</h3>*/}
        {/*        <p className="text-blue-400 mb-3">Art Director</p>*/}
        {/*        <p className="text-gray-300 text-sm">*/}
        {/*          Creates the vibrant, engaging visual experiences that make our games */}
        {/*          memorable and instantly recognizable.*/}
        {/*        </p>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</section>*/}

        {/* Company Values */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Values</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <i className="ri-heart-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Player-Centric Design</h3>
                </div>
                <p className="text-gray-300">
                  Every decision we make is guided by what will create the best experience 
                  for our players. We listen to feedback and continuously improve our games.
                </p>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-2xl border border-green-500/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <i className="ri-team-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Collaborative Spirit</h3>
                </div>
                <p className="text-gray-300">
                  We believe the best games come from diverse perspectives working together. 
                  Our team thrives on open communication and shared creativity.
                </p>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl border border-yellow-500/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <i className="ri-rocket-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Continuous Innovation</h3>
                </div>
                <p className="text-gray-300">
                  We're never satisfied with "good enough." Each project pushes us to 
                  explore new ideas and challenge conventional game design.
                </p>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 rounded-2xl border border-cyan-500/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center">
                    <i className="ri-shield-check-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Quality First</h3>
                </div>
                <p className="text-gray-300">
                  We'd rather ship one polished, incredible game than multiple mediocre ones. 
                  Quality and attention to detail are never compromised.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
