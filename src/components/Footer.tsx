import React from 'react';
import { Facebook, Twitter, Instagram, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onViewChange: (view: string) => void;
}

export default function Footer({ onViewChange }: FooterProps) {
  const handleNavClick = (view: string) => {
    onViewChange(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-20 px-4 md:py-24 text-center">
      <div className="mx-auto max-w-[1200px] flex flex-col items-center">
        {/* Animated Brand & Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center w-full"
        >
          {/* Brand Section */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex flex-col items-center justify-center focus:outline-none group cursor-pointer"
            id="footer-logo-btn"
          >
            <span className="serif text-3xl font-black tracking-widest uppercase text-[#062A73] transition-colors group-hover:text-[#FF5A1F] leading-none">
              YAVA
            </span>
            <p className="text-[10px] tracking-[0.3em] font-bold text-gray-400 mt-3.5 uppercase leading-none">
              CONNECTING PEOPLE... EVERYWHERE
            </p>
          </button>

          {/* Follow Us Section */}
          <h4 className="text-xs font-black tracking-[0.25em] text-[#062A73] uppercase mt-12 mb-6">
            FOLLOW US
          </h4>

          {/* Social Icons (56px square rounded buttons) */}
          <div className="flex items-center justify-center gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-white border border-gray-200 text-[#062A73] hover:bg-[#FF5A1F] hover:text-white hover:border-[#FF5A1F] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              aria-label="Facebook"
            >
              <Facebook className="h-5.5 w-5.5 stroke-[1.75]" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-white border border-gray-200 text-[#062A73] hover:bg-[#FF5A1F] hover:text-white hover:border-[#FF5A1F] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              aria-label="Instagram"
            >
              <Instagram className="h-5.5 w-5.5 stroke-[1.75]" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-white border border-gray-200 text-[#062A73] hover:bg-[#FF5A1F] hover:text-white hover:border-[#FF5A1F] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              aria-label="X (Twitter)"
            >
              <Twitter className="h-5.5 w-5.5 stroke-[1.75]" />
            </a>
            <a 
              href="https://yava.mw" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-white border border-gray-200 text-[#062A73] hover:bg-[#FF5A1F] hover:text-white hover:border-[#FF5A1F] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              aria-label="Website"
            >
              <Globe className="h-5.5 w-5.5 stroke-[1.75]" />
            </a>
          </div>

          {/* Centered Thin Divider */}
          <div className="w-full max-w-[240px] h-[1px] bg-gray-200 my-10" />

          {/* Bottom Section */}
          <div className="space-y-2 text-[11px] text-gray-400 font-medium tracking-wide">
            <p className="uppercase tracking-[0.05em] font-semibold">
              &copy; 2026 YAVA. All Rights Reserved.
            </p>
            <p>
              Designed by <span className="text-[#FF5A1F] font-bold">Xhovilé Creative Studio</span>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
