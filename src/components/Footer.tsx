import React from 'react';
import { Bus, Phone, Mail, Clock, Facebook, Twitter, Instagram } from 'lucide-react';
import { OFFICE_CONTACTS } from '../data';

interface FooterProps {
  onViewChange: (view: string) => void;
}

export default function Footer({ onViewChange }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (view: string) => {
    onViewChange(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b1d3a] text-paper border-t border-ink-fade pt-16 pb-8 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left focus:outline-none"
              id="footer-logo-btn"
            >
              <div className="flex h-9 w-9 items-center justify-center bg-white text-ink">
                <Bus className="h-4.5 w-4.5 stroke-[1.5]" />
              </div>
              <div>
                <span className="serif text-lg font-bold tracking-tighter uppercase text-white">
                  STARLINK
                </span>
                <span className="block text-[8px] uppercase tracking-[0.25em] text-gold font-bold">
                  Executive Travel
                </span>
              </div>
            </button>
            <p className="text-xs text-paper/80 leading-relaxed max-w-xs">
              Malawi&apos;s premier luxury intercity coach service. Redefining passenger comfort, safety, and reliability between Blantyre and Lilongwe.
            </p>
            
            {/* Social Icons with Gold accents */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://facebook.com/starlinktoursmw" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-8 w-8 items-center justify-center bg-white/5 border border-white/10 text-paper/70 hover:bg-gold hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com/starlinktours" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-8 w-8 items-center justify-center bg-white/5 border border-white/10 text-paper/70 hover:bg-gold hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com/starlinktours" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-8 w-8 items-center justify-center bg-white/5 border border-white/10 text-paper/70 hover:bg-gold hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-5">
              Office Contacts
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[8px] text-paper/40 uppercase font-bold tracking-wider">Call Center</span>
                  <a href={`tel:${OFFICE_CONTACTS.phone}`} className="text-paper hover:text-gold font-bold">
                    {OFFICE_CONTACTS.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[8px] text-paper/40 uppercase font-bold tracking-wider">WhatsApp Line</span>
                  <a href={`https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-paper hover:text-gold font-bold">
                    {OFFICE_CONTACTS.whatsapp}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[8px] text-paper/40 uppercase font-bold tracking-wider">Email Support</span>
                  <a href={`mailto:${OFFICE_CONTACTS.email}`} className="text-paper hover:text-gold font-bold">
                    {OFFICE_CONTACTS.email}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Pickup Locations */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-5">
              Our Terminals
            </h3>
            <div className="space-y-4 text-xs leading-relaxed">
              <div>
                <span className="block text-white font-bold mb-1">Blantyre Departure Terminal</span>
                <p className="text-paper/80">{OFFICE_CONTACTS.blantyre.address}</p>
                <span className="flex items-center gap-1 text-paper/50 mt-1 text-[10px] font-semibold">
                  <Clock className="h-3 w-3" /> {OFFICE_CONTACTS.blantyre.hours}
                </span>
              </div>
              <div>
                <span className="block text-white font-bold mb-1">Lilongwe Area 3 Office</span>
                <p className="text-paper/80">{OFFICE_CONTACTS.lilongwe.address}</p>
                <span className="flex items-center gap-1 text-paper/50 mt-1 text-[10px] font-semibold">
                  <Clock className="h-3 w-3" /> {OFFICE_CONTACTS.lilongwe.hours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase font-bold tracking-wider">
          <div className="text-center sm:text-left">
            <p className="text-paper/60">&copy; {new Date().getFullYear()} Starlink Tours &amp; Travel. All rights reserved.</p>
          </div>
          <div className="text-center sm:text-right normal-case text-[11px] text-paper/80 font-medium space-y-1">
            <div>
              Designed by: <a href="https://wa.me/265992948283" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline transition-all font-bold">Isaac Mtsiriza</a>
            </div>
            <div>
              Contact : <a href="https://wa.me/265992948283" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline transition-all font-bold">0992948283</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
