import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ArrowRight } from 'lucide-react';
import ContactModal from './ContactModal';
import ProjectBuddyLogo from './ProjectBuddyLogo';

export default function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Systems", href: "/systems" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="container-visual px-4 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Official Project Buddy Logo */}
          <Link href="/" className="group cursor-pointer">
            <ProjectBuddyLogo showTagline={false} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0B132B] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0B132B] hover:bg-slate-100/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setContactModalOpen(true)}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#0052FF] hover:bg-[#0042CC] shadow-md shadow-[#0052FF]/20 hover:shadow-lg hover:shadow-[#0052FF]/30 transition-all duration-200"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setContactModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0052FF]"
            >
              Start
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white/98 backdrop-blur-2xl pt-24 px-6 pb-8 flex flex-col justify-between lg:hidden overflow-y-auto">
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
              Navigation
            </div>
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-xl text-lg font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#0052FF]/10 text-[#0052FF]'
                      : 'text-[#0B132B] hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setContactModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#0052FF] shadow-lg shadow-[#0052FF]/20"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-center text-slate-400">
              Project Buddy — Turn idea into reality
            </p>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </>
  );
}
