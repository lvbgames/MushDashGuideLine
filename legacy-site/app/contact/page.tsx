'use client';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Get In <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions about our games? Want to collaborate? Or just want to say hi? 
              We'd love to hear from you!
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30">
                <h2 className="text-3xl font-bold text-white mb-8">Send us a Message</h2>
                
                {isSubmitted && (
                  <div className="bg-green-600/20 border border-green-500/50 text-green-400 p-4 rounded-lg mb-6">
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-fill"></i>
                      <span>Message sent successfully! We'll get back to you soon.</span>
                    </div>
                  </div>
                )}
                
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-8 bg-white/10 border border-gray-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors text-sm appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-black text-white">Select a topic</option>
                        <option value="general" className="bg-black text-white">General Inquiry</option>
                        <option value="support" className="bg-black text-white">Game Support</option>
                        <option value="business" className="bg-black text-white">Business Partnership</option>
                        <option value="press" className="bg-black text-white">Press & Media</option>
                        <option value="feedback" className="bg-black text-white">Game Feedback</option>
                        <option value="bug" className="bg-black text-white">Bug Report</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <i className="ri-arrow-down-s-fill text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      maxLength={500}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm resize-vertical"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                    <div className="text-right text-sm text-gray-400 mt-1">
                      {formData.message.length}/500 characters
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formData.message.length > 500}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:hover:scale-100 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-send-plane-fill mr-2"></i>
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-purple-600/20 p-8 rounded-2xl border border-purple-500/30">
                  <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <i className="ri-mail-fill text-white text-xl"></i>
                      </div>
                      <div>
                        <div className="text-sm text-gray-300">Email</div>
                        <div className="text-white font-semibold">hello@lvbgames.com</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <i className="ri-discord-fill text-white text-xl"></i>
                      </div>
                      <div>
                        <div className="text-sm text-gray-300">Discord</div>
                        <div className="text-white font-semibold">LvB Games Official</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <i className="ri-twitter-fill text-white text-xl"></i>
                      </div>
                      <div>
                        <div className="text-sm text-gray-300">Twitter</div>
                        <div className="text-white font-semibold">@LvBGames</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                        <i className="ri-time-fill text-white text-xl"></i>
                      </div>
                      <div>
                        <div className="text-sm text-gray-300">Response Time</div>
                        <div className="text-white font-semibold">24-48 hours</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-600/20 p-8 rounded-2xl border border-green-500/30">
                  <h3 className="text-2xl font-bold text-white mb-4">Business Inquiries</h3>
                  <p className="text-gray-300 mb-6">
                    Interested in partnerships, sponsorships, or collaboration opportunities? 
                    We're always open to exciting new ventures.
                  </p>
                  <div className="flex items-center space-x-2 text-green-400">
                    <i className="ri-mail-fill"></i>
                    <span className="font-semibold">business@lvbgames.com</span>
                  </div>
                </div>

                <div className="bg-blue-600/20 p-8 rounded-2xl border border-blue-500/30">
                  <h3 className="text-2xl font-bold text-white mb-4">Press & Media</h3>
                  <p className="text-gray-300 mb-6">
                    Media kit, press releases, and interview requests for gaming publications 
                    and content creators.
                  </p>
                  <div className="flex items-center space-x-2 text-blue-400">
                    <i className="ri-article-fill"></i>
                    <span className="font-semibold">press@lvbgames.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-black/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-300">
                Quick answers to common questions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-4">
                  How can I report a bug in MushDash?
                </h3>
                <p className="text-gray-300">
                  Use our contact form with "Bug Report" selected, or join our Discord server 
                  for immediate community support and bug reporting.
                </p>
              </div>
              
              <div className="bg-green-900/20 p-6 rounded-2xl border border-green-500/30">
                <h3 className="text-xl font-bold text-white mb-4">
                  Are you hiring game developers?
                </h3>
                <p className="text-gray-300">
                  We're always interested in talented developers! Send your portfolio 
                  and resume to our general contact email with "Career" in the subject.
                </p>
              </div>
              
              <div className="bg-blue-900/20 p-6 rounded-2xl border border-blue-500/30">
                <h3 className="text-xl font-bold text-white mb-4">
                  Can I suggest features for your games?
                </h3>
                <p className="text-gray-300">
                  Absolutely! We love hearing from our community. Use the "Game Feedback" 
                  option in our contact form to share your ideas.
                </p>
              </div>
              
              <div className="bg-orange-900/20 p-6 rounded-2xl border border-orange-500/30">
                <h3 className="text-xl font-bold text-white mb-4">
                  Do you offer refunds for your games?
                </h3>
                <p className="text-gray-300">
                  Refund policies depend on the platform (Steam, Epic, etc.). Contact our 
                  support team if you're experiencing issues with a purchase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Studio</h2>
              <p className="text-xl text-gray-300">
                Visit us at our creative space in the heart of the gaming district
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30">
                <h3 className="text-2xl font-bold text-white mb-6">Lv.B Games Studio</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-map-pin-fill text-purple-400 text-xl mt-1"></i>
                    <div>
                      <div className="text-white font-semibold">Address</div>
                      <div className="text-gray-300">
                        1234 Gaming Boulevard<br/>
                        Tech District, San Francisco<br/>
                        CA 94102, United States
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <i className="ri-time-fill text-green-400 text-xl"></i>
                    <div>
                      <div className="text-white font-semibold">Office Hours</div>
                      <div className="text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM PST</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <i className="ri-phone-fill text-blue-400 text-xl"></i>
                    <div>
                      <div className="text-white font-semibold">Phone</div>
                      <div className="text-gray-300">+1 (555) 123-GAME</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                    <i className="ri-information-fill"></i>
                    <span className="font-semibold">Note</span>
                  </div>
                  <p className="text-yellow-200 text-sm">
                    Office visits are by appointment only. Please contact us in advance 
                    if you'd like to visit our studio.
                  </p>
                </div>
              </div>
              
              <div className="h-96 rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0197469614194!2d-122.4194183846816!3d37.77492987975906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}